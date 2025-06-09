import { decryptJWT } from "../jwt.js";
import { getUsers } from '../db/user.js';

export default async function (req, res, url) {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.statusCode = 401;
            res.end(JSON.stringify({ error: true, message: 'Отсутствует токен авторизации' }));
            return;
        }

        const token = authHeader.slice(7); // удаляет "Bearer " (7 символов)
        const payload = await decryptJWT(token);

        if (!payload) {
            res.statusCode = 401;
            res.end(JSON.stringify({ error: true, message: 'Доступ запрещен' }));
            return;
        }

        const { email } = payload;
        const users = await getUsers({})
        const user = users.find(user => {
            return user.email === email;
        });

        if (!user) {
            res.statusCode = 401;
            res.end(JSON.stringify({ error: true, message: 'Токен просрочен или неправилен' }));
            return;
        }

        const { password, ...userWithoutPassword } = user;

        res.statusCode = 201;
        res.end(JSON.stringify(userWithoutPassword));

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
