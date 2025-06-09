import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dbPath = join(process.cwd(), 'db', 'users.json');

export async function getUsers() {
    return JSON.parse(readFileSync(dbPath, { encoding: 'utf8' }));
}

export async function createUser(user = {}) {
    const users = JSON.parse(readFileSync(dbPath, { encoding: 'utf8' }));
    users.push(user);

    writeFileSync(
        dbPath,
        JSON.stringify(users, null, 4),
        { encoding: 'utf8' }
    );
    return true;
}

