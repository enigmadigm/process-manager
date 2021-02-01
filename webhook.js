const express = require('express');
const { WEBHOOK_SECRET } = require("./config.json");
const crypto = require('crypto');
const cp = require("child_process");
const bodyParser = require('body-parser')
//const http = require('http');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.header("x-powered-by", "Sadness")
    next();
});

app.use(bodyParser.json({
    verify(req, res, buf) {
        req.github_hub = false;
        if (req.headers && req.headers['x-hub-signature'] && typeof req.headers['x-hub-signature'] === "string") {
            req.github_hub = true;
            const xHub = req.headers['x-hub-signature'].split('=');

            req.github_hex = crypto.createHmac(xHub[0], WEBHOOK_SECRET)
                .update(buf)
                .digest('hex');
            req.github_signature = xHub[1];
        }
    }
}));

app.get("/", (req, res) => {
    res.sendStatus(401);
});

app.post("/", (req, res) => {
    console.log("Incoming POST request on GitHub GreenMesa update endpoint.");

    if (req.github_hub) {
        if (req.github_hex === req.github_signature) {
            res.sendStatus(201);
            if (req.body && req.body.ref && typeof req.body.ref === "string") {
                if (req.body.ref === "refs/heads/dev-main") {// https://api.github.com/repos/enigmadigm/greenmesa/branches/master
                    cp.exec("")
                    //cp.exec(`cd ${repo} && git pull`);
                }
            }
            return;
        }
    }
    res.sendStatus(401);
});

app.listen(8080, () => console.log("Listing on port 8080"));

/*http.createServer(function (req, res) {
    req.on('data', function(chunk) {
        const sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');

        if (req.headers['x-hub-signature'] == sig) {
        	if ("https://api.github.com/repos/enigmadigm/greenmesa/branches/master") {
        		console.log(req.body);
        	}
            //cp.exec(`cd ${repo} && git pull`);
        }
    });

    res.end();
}).listen(8080);*/
