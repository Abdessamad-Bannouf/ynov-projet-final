terraform {
  required_providers {
    random = {
      source  = "hashicorp/random"
      version = ">= 3.4.8"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

resource "google_artifact_registry_repository" "app_repo" {
  location      = var.region
  repository_id = "containers"
  format        = "DOCKER"

  lifecycle {
    prevent_destroy = true
    ignore_changes  = [format]
  }
}


resource "google_sql_database_instance" "postgres" {
  name                = "postgres-instance${random_string.suffix.result}"
  database_version    = "POSTGRES_14"
  region              = var.region
  deletion_protection = false
  settings {
    tier = "db-f1-micro"
  }
}

resource "google_sql_database" "app_db" {
  name     = "db"
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "default" {
  name     = "postgres"
  instance = google_sql_database_instance.postgres.name
  password = "postgres" # à sécuriser en prod}
}


resource "google_cloud_run_service" "express_api" {
  name     = var.service_name
  location = var.region
  template {
    spec {
      containers {
        image = var.image_url
        env {
          name  = "DATABASE_URL"
          value = "postgresql://postgres:postgres@postgres/db"
        }
        ports {
          container_port = 8080
        }
      }
      container_concurrency = 80
    }
    metadata {
      annotations = {
        "run.googleapis.com/cloudsql-instances" = "${var.project_id}:${var.region}:${google_sql_database_instance.postgres.name}"
        "autoscaling.knative.dev/maxScale"      = "5"
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_member" "public_invoker" {

  location = var.region

  service = google_cloud_run_service.express_api.name

  role = "roles/run.invoker"

  member = "allUsers"

}

resource "google_cloud_run_service" "react_app" {
  name     = var.react_service_name
  location = var.region

  template {
    spec {
      containers {
        image = var.react_image_url
        ports {
          container_port = 8080
        }
      }
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "3"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_member" "public_invoker_react" {
  location = var.region
  service  = google_cloud_run_service.react_app.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}