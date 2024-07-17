import { WebSocket, WebSocketServer } from "ws";

let senderSocket: null | WebSocket = null;
let recieverSocket: null | WebSocket = null;

const wss = new WebSocketServer({port: 8080});

wss.on("connection", (ws)=>{
    ws.on("error", ()=>console.error);
    ws.on("message", (data: any)=>{
        const message = JSON.parse(data);
        if(message.type === "sender")
            senderSocket = ws;
        else if(message.type === "reciever")
            recieverSocket = ws;
        else if(message.type === "createOffer")
            recieverSocket?.send(JSON.stringify({type: "createOffer", sdp: message}));
        else if(message.type === "createAnswer")
            senderSocket?.send(JSON.stringify({type: "createAnswer", sdp: message}));
        else if(message.type === "iceCandidates"){
            if(ws === senderSocket){
                recieverSocket?.send(JSON.stringify({type: "iceCandidates", candidate: message}));
            }
            else if(ws === recieverSocket){
                senderSocket?.send(JSON.stringify({type: "iceCandidates", candidate: message}));

            }
        }
            
    })
})