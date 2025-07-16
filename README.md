
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
  A[Utilisateur] --> B[Cloud Run React]
  B --> C[Cloud Run Express API]
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
├── main.tf \
├── variables.tf \
├── terraform.tfvars \
├── Dockerfile.express \
├── Dockerfile.react \
├── cloudrun/ \
│   └── Terraform \
│        └── main.tf \
│        └── output.tf \
│        └── variables.ts \
│        └── Dockerfile.express \
│        └── Dockerfile.react \
├── frontend/ \
│   └── src/ \
└── App.css \
└── App.js \
└── index.css \
└── index.js \
├── backend/ \
│    └── config/ \
│    └── controllers/ \
│    └── middlewares/ \
│    └── models/ \
│    └── prisma/ \
│    └── routes/ \
│    └── scripts/ \
│    └── controllers/ \
│    └── utils/ \
│    └── prisma/ \
│       └── schema.prisma


## 🔐 Configuration Google API (OAUTH + Calendar)

### 1. Accédez à Google Cloud Console.

### 2. Créez un projet ou utilisez-en un existant.

### 3. Activez l’API Google Calendar.

### 4. Créez des identifiants OAuth 2.0 :

### 5. Créez un fichier .env :

```
PORT=3000
CLIENT_ID="YOUR_CLIENT_ID"
CLIENT_SECRET="YOUR_CLIENT_SECRET"
REDIRECT_URL="http://localhost:3000/api/calendar/oauth2callback"
```

## 📂 Configuration du dossier config pour la database

### - Créer un dossier "config" à la racine du dossier backend.

#### - Ensuite dans ce dossier créer un fichier .env et rajouter les lignes suivantes :

```
POSTGRES_USER=postgres
POSTGRES_DB=postgres
PGADMIN_DEFAULT_EMAIL=admin@domain.com
```

### Créer un autre .env mais cette fois-ci à la racine du dossier backend lui-même (primordial pour que Prisma s'exécute correctement)
- Copier cette ligne avec les valeurs suivantes :

```
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/postgres?schema=public"
```

### - Créer un fichier "db_password.txt" à la racine du projet.

#### - Ensuite dans ce fichier ajouter la mot de passe de la base de données suivant :

```
postgres
```

### - Créer un fichier "pgadmin_password.txt" à la racine du projet.

#### - Ensuite dans ce fichier ajouter le mot de passe de pg admin suivant :

```
postgres
```


## 🐳 Installation et exécution avec Docker

### 1. Build des containers express / postgreSQL / pgAdmin

```
docker-compose build
```

### 2. Lancement des containers en détaché

```
docker-compose up -d
```
\

---
## 🗃️ Base de données

### Connexion au sein de pgAdmin

Aller sur l'url :

    http://localhost:5050

Mettre comme login :

    admin@domain.com

Mettre le password correspondant.

### Création de la database au sein de pgAdmin

Ensuite sur l'interface pgAdmin cliquer sur Add New Server

- Dans l'onglet général mettre un nom pour le serveur

- Après cliquer sur l'onglet connection puis dans Host name mettre : postgres

- Dans le champ port mettre : 5432

- Dans le champ username mettre : postgres

- Dans le champ password mettre le password correspondant

### PRISMA ORM : migrations

- Se connecter au container express js via la commande : docker exec -it expressjs bash
- lancer la commande : npx prisma migrate dev --name init

### Inscription

- Aller sur l'url localhost:3000/register et s'inscrire
- Se connecter via l'url localhost:3000/login

---

## 📌 Notes

L'application est exposée sur le port 3000. Vous pouvez y accéder via http://localhost:3000.
Si vous modifiez le code, techniquement les changements seront raffraichis automatiquement grâce à Nodemon.

---

## 🛠 Technologies utilisées

- Node.js avec Express.js pour le backend.
- PostgreSQL pour le SGBDR
- pgAdmin pour l'interface de postgreSQL
- PrismaORM pour tout ce qui est communication avec la base de données
- ReactJS pour le front
- Docker pour la conteneurisation.

## Technologies
***
Une liste complète des technologies sur le projet :
* [Node JS](https://nodejs.org/en/download/package-manager): Version 23


