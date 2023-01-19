import express from "express";
import fs from 'fs';
import { createServer } from "http";

import { Server } from "socket.io";
import { exec } from "child_process";

try{
    const data = fs.readFileSync('./public/camera.jpg');
    if(data){
        exec('rm ./public/camera.jpg');
    }
}catch(unknown){
    console.log('nothing image');
}

exec('./camera');

const app = express();
//const httpServer = http.createServer(app);
const httpServer = createServer(app);

const io = new Server(httpServer);

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: './public' });
});

const PORT = 3000;
const interval = 400;
let intervalId;
let count = 0;

io.on('connection', socket => {

    if(count == 0){
        console.log("interval create");
        sendScreen();
    }
    count++;

    socket.on("disconnect", () => {
        count--;
        
        if(count == 0){
            console.log('interval delete');
            clearInterval(intervalId);
        }
    })

});


let PreBase64_data;
async function sendScreen() {

    intervalId = setInterval(() => {
        
        fs.readFile('./public/camera.jpg', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const base64_data = "data:image/jpeg;base64," + data.toString('base64');
                if(base64_data != PreBase64_data){
                    io.emit("screen", base64_data);
                    PreBase64_data = base64_data;
                }
            }
        })

    }, interval);
};

httpServer.listen(PORT, function () {
    console.log('server listening. Port:' + PORT);
    console.log('http://localhost:' + PORT);
});