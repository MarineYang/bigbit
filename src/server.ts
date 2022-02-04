import express from 'express';
import { createServer, Server } from "http"

import App from "./index"
try {
    const server = createServer(express)
    const app = new App(server)
    
    server.listen(9090, function() {
        console.log('Socket IO server listening on port 3000');
    });

} catch (error ) { 
    console.log(error)
}

