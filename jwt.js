import { createHmac, randomBytes, pbkdf2Sync, timingSafeEqual } from 'node:crypto';

const secret = 'dxGl4JVExwRsXCQiBxT0';
const SALT_LENGTH = 16;
const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST_ALGORITHM = 'sha512';

const CLOCK_SKEW_SECONDS = 30; // Допустимая разница во времени в секундах

function base64url(input) {
    return Buffer.from(input)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function sign(data) {
    return base64url(
        createHmac(DIGEST_ALGORITHM, secret).update(data).digest()
    );
}

export function hashPassword(password) {
    const salt = randomBytes(SALT_LENGTH).toString('hex');

    // Добавим секрет к паролю (в качестве "pepper"):
    const passwordWithSecret = password + secret;

    const derivedKey = pbkdf2Sync(
        passwordWithSecret,
        salt,
        ITERATIONS,
        KEY_LENGTH,
        DIGEST_ALGORITHM
    ).toString('hex');

    return `${salt}:${ITERATIONS}:${derivedKey}`;
}

export function comparePassword(hashedPassword, sourcePassword) {
    const parts = hashedPassword.split(':');

    if (parts.length !== 3) return false; // простая валидация формата

    const [salt, iterationsStr, key] = parts;
    const iterations = parseInt(iterationsStr, 10);

    if (Number.isNaN(iterations)) return false;

    const sourcePasswordWithSecret = sourcePassword + secret;
    const derivedKey = pbkdf2Sync(
        sourcePasswordWithSecret,
        salt,
        iterations,
        key.length / 2,
        DIGEST_ALGORITHM
    ).toString('hex');

    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKeyBuffer = Buffer.from(derivedKey, 'hex');

    return timingSafeEqual(keyBuffer, derivedKeyBuffer);
}

/**
 * Создаёт и подписывает JWT (JSON Web Token) с опциональными сроками действия и стандартными полями.
 *
 * @param {Object} payload - Полезная нагрузка токена (произвольный объект с данными).
 * @param {Object} [options] - Опции для настройки токена.
 * @param {number} [options.expiresInSeconds=0] - Время жизни токена в секундах. Если 0 или не передано, поле `exp` не добавляется (токен бессрочный).
 * @param {number} [options.notBeforeDelay=0] - Задержка перед началом действия токена в секундах (поле `nbf`). По умолчанию 0 — токен действует сразу.
 * @param {string} [options.audience] - Значение поля `aud` (аудитория токена).
 * @param {string} [options.subject] - Значение поля `sub` (субъект токена).
 * @returns {string} - Сформированный JWT в формате base64url(header).base64url(payload).signature.
 *
 * В payload автоматически добавляются стандартные поля:
 * - `iat` (issued at) — время выпуска токена (в секундах UNIX),
 * — `exp` (expiration) — время истечения срока действия (если `expiresInSeconds > 0`),
 * — `nbf` (not before) — время начала действия токена (если `notBeforeDelay > 0`),
 * — `aud` (audience) — аудитория токена (если передано),
 * — `sub` (subject) — субъект токена (если передано),
 * — `jti` (JWT ID) — уникальный идентификатор токена.
 */
export function encryptJWT(payload, options = {}) {
    const now = Math.floor(Date.now() / 1000);
    const {
        expiresInSeconds = 0,
        notBeforeDelay = 0,
        audience,
        subject
    } = options;

    const jwtPayload = {
        ...payload,
        iat: now,
        ...(expiresInSeconds > 0 ? { exp: now + expiresInSeconds } : {}),
        ...(notBeforeDelay > 0 ? { nbf: now + notBeforeDelay } : {}),
        ...(audience ? { aud: audience } : {}),
        ...(subject ? { sub: subject } : {}),
        jti: randomBytes(8).toString('hex')
    };

    const header = { alg: 'HS256', typ: 'JWT' };
    const headerEncoded = base64url(JSON.stringify(header));
    const payloadEncoded = base64url(JSON.stringify(jwtPayload));
    const signature = sign(`${headerEncoded}.${payloadEncoded}`);

    return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

/**
 * Расшифровывает, проверяет подпись и валидирует JWT.
 *
 * @param {string} token - JWT в формате base64url(header).base64url(payload).signature.
 * @param {Object} [options] - Опции для дополнительной проверки.
 * @param {string} [options.audience] - Ожидаемое значение поля `aud` (если указано, будет проверено).
 * @param {string} [options.subject] - Ожидаемое значение поля `sub` (если указано, будет проверено).
 * @returns {Object|null} - Объект полезной нагрузки (payload) если токен валиден, или `null` если:
 *                         подпись не совпадает, токен просрочен, ещё не действует,
 *                         аудитория или субъект не совпадают, или токен повреждён/некорректен.
 *
 * Проверяются следующие условия:
 * - Валидность подписи HMAC SHA256.
 * - Срок действия `exp` (если есть) с учётом запаса времени (CLOCK_SKEW_SECONDS).
 *   Если токен просрочен — возвращается null.
 * - Время начала действия `nbf` (если есть) с учётом запаса времени.
 *   Если токен ещё не активен — возвращается null.
 * - Время выпуска `iat` (если есть) с учётом запаса времени.
 *   Если токен выпущен в будущем — возвращается null.
 * - Совпадение значений полей `aud` и `sub` с ожидаемыми, если они заданы в опциях.
 *
 * CLOCK_SKEW_SECONDS — небольшой запас времени (в секундах) для компенсации
 * возможной рассинхронизации часов между сервером и клиентом.
 */
export function decryptJWT(token, options = {}) {
    const [headerB64, payloadB64, signature] = token.split('.');
    const expectedSignature = sign(`${headerB64}.${payloadB64}`);

    if (signature !== expectedSignature) {
        return null;
    }

    try {
        const payloadJson = Buffer.from(payloadB64, 'base64url').toString();
        const payload = JSON.parse(payloadJson);

        const now = Math.floor(Date.now() / 1000);

        if (payload.exp && now - CLOCK_SKEW_SECONDS >= payload.exp) return null;
        if (payload.nbf && now + CLOCK_SKEW_SECONDS < payload.nbf) return null;
        if (payload.iat && now + CLOCK_SKEW_SECONDS < payload.iat) return null;

        if (options.audience && payload.aud !== options.audience) return null;
        if (options.subject && payload.sub !== options.subject) return null;

        return payload;
    } catch {
        return null;
    }
}
