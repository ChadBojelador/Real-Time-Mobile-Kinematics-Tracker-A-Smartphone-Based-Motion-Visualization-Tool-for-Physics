import express from express
import { userLogin } from "../controllers/controller.js"
const router = express.router

router.get('login',userLogin);