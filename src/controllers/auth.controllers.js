import authService from "../services/auth.services.js";
import ServerError from "../helpers/ServerErrors.js";

class AuthController {
    async register(req, res) {
        try {
            const { nombre, email, password } = req.body;

            const created_user = await authService.register(nombre, email, password)

            return res.status(201).json({
                ok: true,
                status: 201,
                message: 'Usuario registrado con exito. Revisa tu email para verificar tu cuenta',
                data: {
                    user: created_user
                }
            })
        }
        catch (error) {
            if (error instanceof ServerError) {
                return res.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                })
            }
            else {
                console.error('Error critico:', error);
                return res.status(500).json({
                    message: 'Error interno del servidor',
                    ok: false,
                    status: 500
                });
            }
        }
    }

    async verifyEmail(req, res) {
        try {
            const { verification_token } = req.query;

            await authService.verifyEmail(verification_token)

            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Email verificado correctamente. Ya podes usar tu cuenta'
            })
        }
        catch (error) {
            if (error instanceof ServerError) {
                return res.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                })
            }
            else {
                console.error('Error critico:', error);
                return res.status(500).json({
                    message: 'Error interno del servidor',
                    ok: false,
                    status: 500
                });
            }
        }
    }

    async login(request, response) {
        try {
            const { email, password } = request.body;

            const { profile_info, access_token } = await authService.login(email, password)

            return response.status(200).json({
                ok: true,
                status: 200,
                message: 'Usuario autenticado exitosamente',
                data: {
                    profile_info,
                    access_token
                }
            })
        }
        catch (error) {
            if (error instanceof ServerError) {
                return response.status(error.status).json({
                    message: error.message,
                    ok: false,
                    status: error.status
                })
            }
            else {
                console.error('Error critico:', error);
                return response.status(500).json({
                    message: 'Error interno del servidor',
                    ok: false,
                    status: 500
                });
            }
        }
    }
}

const authController = new AuthController();
export default authController