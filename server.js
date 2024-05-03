const http = require("http");
const { v4: uuidv4 } = require("uuid");

const httpListenPort = process.env.PORT || 3005;

const responseHeaders = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
}

/**
 * @param {*} res 
 * @param {*} data If is not `null`, this is the value of key "data" in the reponse body.
 *                 If is `null`, the response has no body.
 */
function respondSuccessful(res, data) {
    res.writeHead(200, responseHeaders);
    if (data !== null) {
        res.write(JSON.stringify({
            status: "successful",
            data: data
        }));
    }
    res.end();
}

function respondFailed(res, statusCode, message) {
    res.writeHead(statusCode, responseHeaders);
    res.write(JSON.stringify({
        status: "failed",
        message: message
    }));
    res.end();
}

/**
 * Throws an Error if title is not found in `body`.
 */
function getTitleFromReqBody(body) {
    const title = JSON.parse(body).title;
    if (title === undefined) {
        throw new Error("title 未填寫");
    }
    return title;
}

const todos = [];

function httpListener(req, res) {
    let body = "";
    req.on("data", (chunck) => body += chunck);

    //
    if (req.url === "/todos" && req.method === "GET") {
        respondSuccessful(res, todos);
    }
    else if (req.url === "/todos" && req.method === "POST") {
        req.on("end", () => {
            try {
                const title = getTitleFromReqBody(body);
                const id = uuidv4();
                todos.push({ title, id });
                respondSuccessful(res, todos);
            } catch (error) {
                respondFailed(res, 404, error.message);
            }
        });
    }


    else if (req.method === "OPTIONS") {
        respondSuccessful(res, null);
    }
    else {
        respondFailed(res, 404, "無此路由");
    }
}

http.createServer(httpListener).listen(httpListenPort);
