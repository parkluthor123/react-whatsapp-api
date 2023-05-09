import http from 'http';
import { Server } from 'socket.io';
import express from 'express'
const app = express()
import cors from 'cors'
const serverHttp = http.createServer(app)

const io = new Server(serverHttp, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
})

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['*', 'Authorization'],
    credentials: true,
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

export {
    serverHttp, 
    io,
    app
}
