const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");


const port = 5000;
const hostname = "127.0.0.1";
//how many file types you want to support on your server
const mineTypes = {
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    png: "image/png",
    jpeg: "image/jpeg",
    jpg: "image/jpg"
};

http.createServer((req,res)=>{
    //shows filename
    let myuri = url.parse(req.url).pathname;
    //use decodeURI() or decodeURIComponent() instead.
    //unescape:- converts spaces between file names to %20 which is default in web browser url
    let filename = path.join(process.cwd(),unescape(myuri))
    console.log("File you are looking for is: " + filename)
    let loadFile;
    try{
        //loads file if available else throws error
             loadFile = fs.lstatSync(filename)
    }
    catch(error){
            res.writeHead(404,{"Content-Type": "text/plain"});
            res.write("404 page not found");
            res.end();
    }

    if(loadFile.isFile()){
        //reverse:- because sometimes people write ab.html.png but exension will be png only
        //extname = finds extension name for you
        //checking if we have supported type extension or not
        var mineType = mineTypes[path.extname(filename).split(".").reverse()[0]];
        res.writeHead(200,{"Content-Type": mineType});
        var filestream = fs.createReadStream(filename);
        filestream.pipe(res);
    } else if(loadFile.isDirectory()){
        res.writeHead(302,{"Location" : "index.html"});
        res.end();
    } else{
        res.writeHead(500,{"Content-Type": "text/plain"});
        res.write("500 Internal error");
        res.end();
    }
}).listen(port,hostname,()=>{
    console.log(`Server is running at ${port}`);
})

//writeHead:- head part of response which is served or read by postman
//write :- webpage on which somebody sees it
