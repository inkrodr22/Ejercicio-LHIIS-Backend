const request = require('supertest');
const app = require('../../server');
const db = require('../config/db');

describe('API de Usuarios', () => {
    let createdUserRFC;

    afterAll(() => {
        db.end();
    });

    test('Debe obtener todos los usuarios', async () => {
        const response = await request(app).get('/api/usuarios');

        console.log('Response body (GET all users):', response.body);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('Debe crear un nuevo usuario', async () => {
        const response = await request(app)
            .post('/api/usuarios')
            .send({
                RFC: 'FFAL920101IT9',
                nombre: 'Juan',
                apellidos: 'Pérez',
                status: 'ACTIVE'
            });

        console.log('Response body (POST user):', response.body);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');

        createdUserRFC = 'FFAL920101IT9';
    });

    test('Debe obtener un usuario por RFC', async () => {
        const response = await request(app)
            .get(`/api/usuarios/${createdUserRFC}`);

        console.log('Response body (GET user by RFC):', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('RFC', createdUserRFC);
    });

    test('No debe encontrar un usuario inexistente', async () => {
        const response = await request(app)
            .get('/api/usuarios/NO_EXISTE');

        console.log('Response body (GET non-existent user):', response.body);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Usuario no encontrado');
    });

    test('No debe permitir crear un usuario sin todos los campos', async () => {
        const response = await request(app)
            .post('/api/usuarios')
            .send({
                RFC: 'TEST98765432',
                nombre: 'Carlos'
            });

        console.log('Response body (POST incomplete user):', response.body);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Todos los campos son obligatorios');
    });

    test('Debe bloquear un usuario por RFC', async () => {
        const RFC = createdUserRFC;

        const response = await request(app)
            .put(`/api/usuarios/${RFC}/bloquear`);

        console.log('Response body (PUT bloquear usuario):', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
            'message',
            `Usuario con RFC ${RFC} bloqueado exitosamente`
        );
    });

    test('No debe bloquear un usuario que ya está bloqueado', async () => {
        const RFC = 'TEST12345678';

        const response = await request(app)
            .put(`/api/usuarios/${RFC}/bloquear`);

        console.log('Response body (PUT usuario ya bloqueado):', response.body);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'El usuario ya está bloqueado');
    });

    test('Debe devolver 404 si el usuario no existe', async () => {
        const RFC = 'USUARIO_NO_EXISTE';

        const response = await request(app)
            .put(`/api/usuarios/${RFC}/bloquear`);

        console.log('Response body (PUT usuario no existe):', response.body);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Usuario no encontrado');
    });



});
