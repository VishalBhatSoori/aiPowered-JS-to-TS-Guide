import cors from 'cors';
import express from 'express';
import aiRoute from './routes/ai.routes.js';

const app = express();

app.use(cors());

app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Hello from JS code reviewer");
})

app.use('/ai',aiRoute);

export default app;