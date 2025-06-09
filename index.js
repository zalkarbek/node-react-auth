import { spawn, exec } from 'child_process';
import { createServer } from 'node:http';

import apiUserAuth from './api/user-auth.js'
import apiUserRegister from './api/user-register.js'
import apiUserPayload from './api/user-payload.js'
import apiUserFetch from './api/user-fetch.js'

import staticRoutes from "./staticRoutes.js";

const server = createServer(
    async (req, res) => {

    const url = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Обрабатываем preflight-запросы
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
    }

    // --------------- Api Routes --------------- //
    if(url.pathname.startsWith('/api') && req.method === 'POST') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        if (url.pathname === '/api/user') {
            apiUserRegister(req, res, url);
        }
        else if (url.pathname === '/api/user/fetch') {
            apiUserFetch(req, res, url);
        }
        else if (url.pathname === '/api/user/auth') {
            apiUserAuth(req, res, url);
        }
        else if(url.pathname === '/api/user/payload') {
            apiUserPayload(req, res, url);
        }
        else if(req.method === 'POST') {
            res.statusCode = 404;
            res.end(JSON.stringify({
                error: true,
                message: 'Not Found',
            }));
        }
    }

    // --------------- Static Routes --------------- //
    else if(req.method === 'GET') {
        staticRoutes(req, res, url);
    }

    return res;
})

// 1. Запускаем React-проект
const reactProcess = spawn('npm', ['run', 'dev'], {
    cwd: './react-auth',
    shell: true,
    stdio: 'inherit'
});

server.listen(3000, () => {
    const REACT_PORT = process.env.REACT_PORT || 5173;
    const url = `http://localhost:${REACT_PORT}`;

    console.log('API сервер запущен на порте: 3000');
    console.log(`Клиентское приложение запущено на порте: ${REACT_PORT}`);

    let command;
    command = `start ${url}`;

    exec(command);
})
