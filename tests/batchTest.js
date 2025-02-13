import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 5,
    iterations: '10',
};

export default function () {
    // Define API endpoints
    const baseUrl = 'https://test-api.k6.io';

    // Define individual requests
    const getCrocodiles = ['GET', `${baseUrl}/public/crocodiles/`];
    const getCrocodileById = ['GET', `${baseUrl}/public/crocodiles/1`];

    const userPayload = JSON.stringify({
        username: `user_${Math.random()}`,
        password: 'password123',
    });

    const registerUser = [
        'POST',
        `${baseUrl}/user/register/`,
        userPayload,
        { headers: { 'Content-Type': 'application/json' } }
    ];

    // Send requests in batch
    let responses = http.batch([
        getCrocodiles,
        getCrocodileById,
        registerUser,
    ]);

    // Check responses
    check(responses[0], { 'GET /crocodiles is 200': (res) => res.status === 200 });
    check(responses[1], { 'GET /crocodiles/1 is 200': (res) => res.status === 200 });
    check(responses[2], { 'User registration is 201': (res) => res.status === 201 });

    sleep(1);
}

