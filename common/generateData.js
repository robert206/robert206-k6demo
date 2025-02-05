import { b64encode } from 'k6/encoding';


export function generateNewUserBody() {
    let vu_id = __VU;  
    let randomNum = Math.floor(Math.random() * 10000); 

    let username = `User${vu_id}${randomNum}`;
    let first_name = `FirstName${vu_id}${randomNum}`;
    let last_name = `LastName${vu_id}${randomNum}`;
    let email = `user${vu_id}${randomNum}@example.com`;
    let password = b64encode(`pass${vu_id}${randomNum}`).slice(0, 12);

    let userData = {
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password
    };
    return { body: JSON.stringify(userData), password: password };
}