require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;
const swaggerDocument = require('./src/config/swagger.json');

app.use(cors());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log('Documentación disponible en https://ejercicio-lhiis-backend-production.up.railway.app/api-docs/');


app.get('/', (req, res) => {
    res.send('API funcionando correctamente. Documentación disponible en https://ejercicio-lhiis-backend-production.up.railway.app/api-docs/');
});

// Rutas
app.use('/api', require('./src/routes/usuarioRoutes'));
app.use('/api', require('./src/routes/transaccionRoutes'));

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;
