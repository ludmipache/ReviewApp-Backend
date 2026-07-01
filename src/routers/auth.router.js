import express from 'express'
import authController from '../controllers/auth.controllers.js'
import validateBody from '../middlewares/validate.middleware.js'

const authRouter = express.Router()

authRouter.post(
    '/register',
    validateBody({
        nombre: { required: true, type: 'string' },
        email: { required: true, type: 'string' },
        password: { required: true, type: 'string' }
    }),
    authController.register
)

authRouter.get(
    '/verify-email',
    authController.verifyEmail
)

authRouter.post(
    '/login',
    validateBody({
        email: { required: true, type: 'string' },
        password: { required: true, type: 'string' }
    }),
    authController.login
)

export default authRouter