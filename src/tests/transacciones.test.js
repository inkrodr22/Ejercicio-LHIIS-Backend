const request = require('supertest');
const app = require('../../server');
const db = require('../config/db');

describe('API de Transacciones', () => {
    let createdTransactionId;

    afterAll(() => {
        db.end();
    });

    test('Debe obtener todas las transacciones', async () => {
        const response = await request(app).get('/api/transacciones');

        console.log('Response body (GET all transactions):', response.body);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('Debe crear una nueva transacción', async () => {
        const response = await request(app)
            .post('/api/transacciones')
            .send({
                RFC: 'FFAL920101IT2',
                fechaRetiro: '2024-03-10',
                monto: 5000,
                comision: 50
            });

        console.log('Response body (POST transaction):', response.body);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('transactionId');

        createdTransactionId = response.body.transactionId;
    });

    test('Debe obtener transacciones filtradas por RFC', async () => {
        const response = await request(app)
            .get('/api/transacciones')
            .query({ RFC: 'FFAL920101IT1' });

        console.log('Response body (GET filtered by RFC):', response.body);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('No debe permitir crear una transacción con un usuario bloqueado', async () => {
        const response = await request(app)
            .post('/api/transacciones')
            .send({
                RFC: 'TEST12345678',
                fechaRetiro: '2024-03-10',
                monto: 5000,
                comision: 50
            });

        console.log('Response body (POST blocked user):', response.body);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Usuario bloqueado, no puede realizar transacciones');
    });

    test('No debe actualizar el estado de una transacción que no está en PENDING', async () => {
        await request(app)
            .put(`/api/transacciones/${createdTransactionId}/status`)
            .send({ status: 'COMPLETED' });

        console.log('Transacción actualizada a COMPLETED');

        const response = await request(app)
            .put(`/api/transacciones/${createdTransactionId}/status`)
            .send({ status: 'FAILED' });

        console.log('Response body (PUT non-PENDING transaction):', response.body);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Solo se pueden actualizar transacciones en estado PENDING');
    });

    test('Debe eliminar (soft delete) una transacción', async () => {
        const response = await request(app)
            .delete(`/api/transacciones/${createdTransactionId}`);

        console.log('Response body (DELETE transaction):', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Transacción eliminada correctamente (soft delete)');
    });

    test('No debe eliminar una transacción que no existe', async () => {
        const response = await request(app)
            .delete(`/api/transacciones/99999`);
        console.log('Response body (DELETE non-existent transaction):', response.body);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Transacción no encontrada');
    });

    test('Debe obtener el resumen de retiros de un usuario', async () => {
        const RFC = 'FFAL920101IT1';

        const response = await request(app)
            .get(`/api/transacciones/resumen/${RFC}`);

        console.log('Response body (GET resumen):', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('RFC', RFC);
        expect(response.body).toHaveProperty('total_retiros');
        expect(response.body).toHaveProperty('monto_total');
        expect(response.body).toHaveProperty('comision_total');
        expect(response.body).toHaveProperty('monto_con_comision');
    });

    test('Debe devolver 404 si el usuario no tiene transacciones', async () => {
        const RFC = 'USUARIO_SIN_TRANSACCIONES';

        const response = await request(app)
            .get(`/api/transacciones/resumen/${RFC}`);

        console.log('Response body (GET resumen sin transacciones):', response.body);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'No hay transacciones para este usuario');
    });


});
