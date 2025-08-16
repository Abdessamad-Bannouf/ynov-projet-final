const path = require('path');
const fs = require('fs');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

function setupSwagger(app) {
    // Si tu utilises un fichier YAML à la racine du projet :
    const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

    // Optionnel : préfixe commun "/api"
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        explorer: true,
        swaggerOptions: {
            persistAuthorization: true,
        },
        customSiteTitle: 'ATS API Docs',
    }));

    console.log('✅ Swagger UI sur http://localhost:3000/docs');
}

module.exports = { setupSwagger };
