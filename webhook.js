require('dotenv').config();

const express = require('express');
const crypto = require('crypto');
const cp = require("child_process");
const bodyParser = require('body-parser')
//const http = require('http');

const app = express();
const repo = process.env.GREENMESA_REPO;
const secret = process.env.WEBHOOK_SECRET;

app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.header("x-powered-by", "Sadness")
    next();
});

app.use(bodyParser.json({
    verify(req, res, buf) {
        req.github_hub = false;
        if (req.headers && req.headers['X-Hub-Signature'] && typeof req.headers['x-hub-signature'] === "string") {
            req.github_hub = true;

            const xHub = req.headers['X-Hub-Signature'].split('=');

            req.github_hex = "sha1=" + crypto.createHmac(xHub[0], secret)
                .update(buf)
                .digest('hex');
            req.github_signature = xHub[1];
        }
    }
}));

app.get("/", (req, res) => {
    res.send(401);
});

app.post("/", (req, res) => {
    console.log("Incoming POST request on GitHub GreenMesa update endpoint.");
    console.log(req.body);

    if (req.github_hub) {
        if (req.github_hex === req.github_signature) {

            if (req.body && req.body.branches_url && typeof req.body.branches_url === "string") {
                req.sendStatus(201);
                if (req.body.branches_url === "https://api.github.com/repos/enigmadigm/greenmesa/branches/master") {
                    console.log('yes');
                    //cp.exec(`cd ${repo} && git pull`);
                }
            }
            
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
