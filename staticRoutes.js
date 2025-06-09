import {extname, join} from "node:path";
import {createReadStream, existsSync} from "node:fs";

const mime = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
};

const staticDir = '../static';

export default (req, res, url) => {
    let filePath = join(staticDir, url.pathname);
    let ext = extname(filePath);

    if (!ext) {
        filePath = join(staticDir, 'index.html');
        ext = '.html';
    }

    if (!existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });

    const stream = createReadStream(filePath);
    stream.pipe(res);

    stream.on('error', (err) => {
        console.error('Stream error:', err);
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
        }
        res.end('500 Internal Server Error');
    });
}
