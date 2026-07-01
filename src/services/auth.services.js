import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import ServerError from '../helpers/ServerErrors.js';
import ENVIRONMENT from '../config/environment.config.js';
import mailer_transport from '../config/mailer.config.js';

class AuthService {
    async register(nombre, email, password){
        if(!nombre || nombre.trim() === ''){
            throw new ServerError('El nombre debe tener al menos 2 caracteres', 400)
        }

        if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            throw new ServerError('Email invalido', 400)
        }

        if(!password || password.length < 6){
            throw new ServerError('Password debe tener al menos 6 caracteres', 400)
        }

        const existing_user = await userRepository.getByEmail(email)
        if(existing_user){
            throw new ServerError('El email ya esta registrado', 400)
        }

        const hashed_password = await bcrypt.hash(password, 10)

        const new_user = await userRepository.create(nombre, email, hashed_password)

        const verification_token = jwt.sign(
            { email: email },
            ENVIRONMENT.JWT_SECRET,
            { expiresIn: '1d' }
        )

        await mailer_transport.sendMail({
            to: email,
            from: ENVIRONMENT.GMAIL_USERNAME,
            subject: 'Verifica tu email',
            html: `
                <h1>Bienvenido/a a ReviewApp</h1>
                <a href="${ENVIRONMENT.URL_BACKEND}/api/auth/verify-email?verification_token=${verification_token}">Click aqui para verificar tu cuenta</a>
            `
        })

        return {
            id: new_user._id,
            nombre: new_user.nombre,
            email: new_user.email
        }
    }

    async verifyEmail(verification_token){
        if(!verification_token){
            throw new ServerError('Falta token de verificacion', 400)
        }

        let payload
        try {
            payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET)
        } catch (error) {
            throw new ServerError('Token invalido o expirado', 401)
        }

        const { email } = payload

        const user = await userRepository.getByEmail(email)
        if(!user){
            throw new ServerError('Usuario no encontrado', 404)
        }

        if(user.email_verificado){
            throw new ServerError('Este email ya fue verificado', 400)
        }

        await userRepository.updateById(user._id, { email_verificado: true })

        return true
    }

    async login(email, password){
        if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            throw new ServerError('Email invalido', 400)
        }

        if(!password || password.length < 6){
            throw new ServerError('Contraseña invalida', 400)
        }

        const user_found = await userRepository.getByEmail(email)
        if(!user_found){
            throw new ServerError('Usuario no registrado', 404)
        }

        if(!user_found.email_verificado){
            throw new ServerError('Debes verificar tu email antes de iniciar sesion', 401)
        }

        const is_same_password = await bcrypt.compare(password, user_found.password)
        if(!is_same_password){
            throw new ServerError('Credenciales invalidas', 401)
        }

        const profile_info = {
            nombre: user_found.nombre,
            email: user_found.email,
            id: user_found._id
        }

        const access_token = jwt.sign(
            profile_info,
            ENVIRONMENT.JWT_SECRET,
            { expiresIn: '7d' }
        )

        return { profile_info, access_token }
    }
}

const authService = new AuthService()
export default authService