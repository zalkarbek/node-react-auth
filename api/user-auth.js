import { encryptJWT, comparePassword } from "../jwt.js";
import { bodyParser } from "../util.js";
import { getUsers } from '../db/user.js';

export default async function (req, res, url) {
    try {
        const body = await bodyParser(req);
        const { email, password } = body;

        if (!email || !password) {
            res.statusCode = 400;
            res.end(
                JSON.stringify({
                    error: true,
                    message: 'нет необходимых полей, не тот формат данных.'
                })
            );
            return;
        }

        const users = await getUsers();
        const user = users.find(user => {
            return user.email === email && comparePassword(user.password, password);
        });

        if (!user) {
            res.statusCode = 401;
            res.end(JSON.stringify({ error: true, message: 'Ошибка логин или пароль неправильны.' }));
            return;
        }

        const token = encryptJWT({
            email: email,
            authenticated: true,
        });

        res.statusCode = 201;
        res.end(JSON.stringify({ token, success: true }));

    } catch (e) {
        res.statusCode = 400;
        res.end(
            JSON.stringify({
                error: true,
                message: 'Неправильный формат данных'
            })
        );
    }
}
