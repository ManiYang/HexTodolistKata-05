const http = require("http");

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

const todos = [];

function httpListener(req, res) {
    let body = "";
    req.on("data", (chunck) => body += chunck);

    //
    if (req.url === "/todos" && req.method === "GET") {
        respondSuccessful(res, todos);
    }


    else if (req.method === "OPTIONS") {
        respondSuccessful(res, null);
    }
    else {
        respondFailed(res, 404, "無此路由");
    }
}

http.createServer(httpListener).listen(httpListenPort);
