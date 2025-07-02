variable "project_id" { default = "spry-effect-464207-v9" }
variable "region" { default = "europe-west9" }

variable "image_url" { default = "europe-west9-docker.pkg.dev/spry-effect-464207-v9/containers/express-api" }
variable "service_name" { default = "express-api" }

variable "react_image_url" { default = "europe-west9-docker.pkg.dev/spry-effect-464207-v9/containers/react-app" }
variable "react_service_name" { default = "react-app" }

variable "db_password" {
  default = "postgres"
  type = string
  description = "Password for the database"
  sensitive   = true
}

variable "db_user" {
  default = "postgres"
  type = string
  description = "Username for the database"
}
