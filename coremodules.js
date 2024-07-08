const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const server = http.createServer((req, res) => {
    // Parse the request URL
    const parsedUrl = url.parse(req.url, true);
    console.log("parsedUrl",parsedUrl)
    // Extract the pathname from the URL
    let pathname = `.${parsedUrl.pathname}`;

    // Handle the root path
    if (pathname === './') {
        pathname = './index.html'; // Assuming index.html as default
    }

    console.log("pathname",pathname);
    
    // Determine the content type based on file extension
    const ext = path.parse(pathname).ext;
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg'
    }[ext] || 'application/octet-stream';

    console.log("ext",ext);
    
    // Read the requested file from filesystem
    fs.readFile(pathname, (err, data) => {
        if (err) {
            // Handle file not found
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`404 Not Found: ${parsedUrl.pathname}`);
        } else {
            // Serve the file with appropriate content type
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
