const http = require('http');

const server = http.createServer();
server.on('request', (req, res) => {
    if (req.url == '/') {
        if (req.method == 'POST') {
            var myData = [];
            req.on('data', chunk => {
                // console.log(JSON.parse(chunk));
                myData.push(chunk);
                // console.log(chunk.toString());
                // myData.push(chunk.toString());
            });
            req.on('end', () => {
                myData = JSON.parse(myData);
                // console.log(myData.name);
                console.log(req.params);
            });
            res.end("done");
        } else {
            res.end("This is get");
        }
    } else if (req.url == '/yo') {
        res.end("This is yo");
    } else {
        res.end("This is not a valid end point");
    }
});
server.listen(3000, () => { console.log("server on http://localhost:3000"); });