import { encryptJWT, hashPassword } from "../jwt.js";
import { bodyParser } from '../util.js';
import { getUsers, createUser } from '../db/user.js';

export default async (req, res, url) => {
    try {
        const body = await bodyParser(req);
        const { email, password } = body;

        if (!email || !password) {
            res.statusCode = 400;
            res.end(
                JSON.stringify({
                    error: true,
                    message: 'Нет необходимых полей, не тот формат данных.'
                })
            );
        }

        const users = await getUsers();
        const existsUser = users.find((u) => {
            return u.email === email;
        });

        if (existsUser) {
            res.statusCode = 409;
            res.end(JSON.stringify({ error: true, message: 'Пользователь с таким email ом уже существует' }));
            return;
        }

        await createUser({ email, password: hashPassword(String(password)) });

        const token = encryptJWT({
            email: email,
            authenticated: true,
        });

        res.statusCode = 201;
        res.end(JSON.stringify({ token, success: true }));

    } catch (e) {
        console.error(e);
        res.statusCode = 400;
        res.end(
            JSON.stringify({
                error: true,
                message: 'Неправильный формат данных',
                trace: e
            })
        );
    }
}
