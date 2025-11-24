import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js';

dotenv.config();
const app = express()
await connectDB

app.use(cors())
app.use(express.json());

const PORT = process.env.PORT || 5000




app.get('/',(req, res)=>{
    res.send('hello world')
})


app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}`)
})
