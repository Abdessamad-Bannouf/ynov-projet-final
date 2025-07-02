
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

### 2. Configurationte

Créer un fichier `secrets.tfvars` :

```hcl
db_password       = "postgres"
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

cd backend
docker build -f ../cloudrun/Dockerfile.express -t europe-west9-docker.pkg.dev/spry-effect-464207-v9/containers/express-api:latest .
docker push europe-west9-docker.pkg.dev/spry-effect-464207-v9/containers/express-api:latest



# Terraform : déploiement
cd cloudrun/terraform/
terraform init
terraform apply -var-file="secrets.tfvars"
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

