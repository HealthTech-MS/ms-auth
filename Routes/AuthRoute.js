import express from "express"
import { register, login, refreshToken, verifyToken, logout, changePassword } from "../Controllers/AuthController.js"

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/changePassword', changePassword)
router.post('/refreshAccessToken', refreshToken)
router.get('/verifyAccessToken', verifyToken)
router.post('/logout', logout)

export default router
