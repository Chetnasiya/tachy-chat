const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const portValue = process.env.PORT || "3000";
const port = Number(portValue);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new RangeError(`PORT must be an integer between 1 and 65535; received "${portValue}".`);
}

const publicDirectory = path.join(__dirname, "public");
const files = {
    "/": {
        path: path.join(__dirname, "views", "index.html"),
        contentType: "text/html; charset=utf-8"
    },
    "/index.html": {
        path: path.join(__dirname, "views", "index.html"),
        contentType: "text/html; charset=utf-8"
    },
    "/js/chat.js": {
        path: path.join(publicDirectory, "js", "chat.js"),
        contentType: "text/javascript; charset=utf-8"
    },
    "/css/styles.css": {
        path: path.join(publicDirectory, "css", "styles.css"),
        contentType: "text/css; charset=utf-8"
    }
};

const server = http.createServer((request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { Allow: "GET, HEAD" });
        response.end("Method Not Allowed");
        return;
    }

    const pathname = (request.url || "/").split("?")[0];
    const file = files[pathname];
    if (!file) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not Found");
        return;
    }

    fs.readFile(file.path, (error, content) => {
        if (error) {
            console.error(`Failed to read ${file.path}:`, error);
            response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Internal Server Error");
            return;
        }

        response.writeHead(200, { "Content-Type": file.contentType });
        response.end(request.method === "HEAD" ? undefined : content);
    });
});

server.listen(port, () => {
    console.log(`Tachy is running at http://localhost:${port}`);
});

server.on("error", (error) => {
    console.error(`Could not start Tachy on port ${port}: ${error.message}`);
    process.exitCode = 1;
});
