import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import {Server} from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config(); 

import roomHandler from './socket/roomHandler.js';


import authRoutes from './routes/auth.js';



const app = express();// In auth.js (routes/auth.js)

import jwt from 'jsonwebtoken';

const router = express.Router();

// Example: User login or authentication route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Authentication logic (dummy example)
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if secret is available
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ error: 'secretOrPrivateKey must have a value' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
    res.json({ token });
});

export default router;


app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(cors());

app.use('/auth', authRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

io.on("connection", (socket) =>{
    console.log("User connected");

    roomHandler(socket);

    socket.on('disconnect', ()=>{
        console.log("user disconnected");
    })

})
const PORT = 6001;
mongoose.connect('mongodb://localhost:27017/meet-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{


    server.listen(PORT, ()=>{
        console.log(`Running @ ${PORT}`);
    });


}).catch((err)=>{
    console.log("Error: ", err);
})