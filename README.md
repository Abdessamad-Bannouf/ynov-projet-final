
# 🌥️ Fullstack Cloud App – React + Express + PostgreSQL on Google Cloud

Ce projet déploie une architecture fullstack moderne sur **Google Cloud Platform (GCP)**, en utilisant :

- ⚙️ **Terraform** pour l'infrastructure as code
- 🖼️ **React** pour le frontend (Cloud Run)
- ⚙️ **Express.js** pour l'API backend (Cloud Run)
- 🐘 **Cloud SQL (PostgreSQL)** comme base de données relationnelle
- 🔐 **Secret Manager** pour sécuriser les mots de passe et les clés JWT
- 📦 **Artifact Registry** pour stocker les images Docker

---

## 📐 Architecture

```mermaid
graph TD
  A[Utilisateur] --> B[Cloud Run (React)]
  B --> C[Cloud Run (Express API)]
  C --> D[Cloud SQL]
  C --> E[Secret Manager]
  F[Terraform] --> B
  F --> C
  F --> D
  F --> E
  F --> G[Artifact Registry]
  B --> G
  C --> G
```

---

## 🚀 Déploiement

### 1. Prérequis

- ✅ Compte GCP avec projet actif
- ✅ Terraform installé (`>= 1.4`)
- ✅ Docker installé
- ✅ `gcloud` CLI configurée et authentifiée

### 2. Configuration

Créer un fichier `terraform.tfvars` :

```hcl
project_id       = "ton-projet-gcp-id"
region           = "europe-west9"

image_url        = "europe-west9-docker.pkg.dev/ton-projet/containers/express-api:latest"
react_image_url  = "europe-west9-docker.pkg.dev/ton-projet/containers/react-app:latest"

db_password      = "postgres"
```

### 3. Déploiement

```bash
# Pousser les images Docker
# Backend : push le docker sur le cloud
cd backend 
docker build -f ../cloudrun/Dockerfile.express -t europe-west9-docker.pkg.dev/spry-effect-464207-v9/containers/express-api:latest .
docker push europe-west9-docker.pkg.dev/spry-effect-464207-v9/containers/express-api:latest

# Frontend : push le docker sur le cloud
cd frontend
docker build -f ../cloudrun/Dockerfile.react -t europe-west9-docker.pkg.dev/spry-effect-464207-v9/containers/react-app:latest .
docker push europe-west9-docker.pkg.dev/spry-effect-464207-v9/containers/react-app:latest

# Terraform : déploiement
terraform init

gcloud artifacts repositories create containers --repository-format=docker --location=europe-west9  --description="Dépôt Docker pour les conteneurs du projet"

cd ../cloudrun/terraform/

terraform init

terraform apply

 gcloud auth configure-docker europe-west9-docker.pkg.dev

gcloud artifacts repositories create containers --repository-format=docker --location=europe-west9  --description="Dépôt Docker pour les conteneurs du projet"

cd backend :

$ gcloud auth configure-docker europe-west9-docker.pkg.dev

docker build -f ../cloudrun/Dockerfile.express -t europe-west9-docker.pkg.dev/spry-effect-464207-v9/containers/express-api:latest .

docker push europe-west9-docker.pkg.dev/spry-effect-464207-v9/containers/express-api:latest

cd ../cloudrun/terraform/

terraform init

terraform apply

 

# Appliquer l'infrastructure
terraform apply
```

---

## 🔐 Sécurité

- 🔑 Secrets stockés dans **Secret Manager**
- 🔒 Connexion à Cloud SQL via **Cloud SQL Auth Proxy** (pas d'IP publique)
- 🌍 Accès HTTP public uniquement pour Cloud Run

---

## 📂 Structure

```
.
├── main.tf
├── variables.tf
├── terraform.tfvars
├── Dockerfile.express
├── Dockerfile.react
├── cloudrun/
│   └── Terraform
│        └── main.tf
│        └── output.tf
│        └── variables.ts
│        └── Dockerfile.express
│        └── Dockerfile.react 
├── frontend/
│   └── src/
        └── App.css
        └── App.js
        └── index.css
        └── index.js
├── backend/
│    └── config/
│    └── controllers/
│    └── middlewares/
│    └── models/
│    └── prisma/
│    └── routes/
│    └── scripts/
│    └── controllers/
│    └── utils/
│    └── prisma/
│       └── schema.prisma
   
```

---

