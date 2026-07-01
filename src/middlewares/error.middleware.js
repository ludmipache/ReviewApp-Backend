import ServerError from "../helpers/ServerErrors.js"

function errorHandler(error, request, response, next) {
    if (error instanceof ServerError) {
        return response.status(error.status).json({
            message: error.message,
            ok: false,
            status: error.status
        })
    }

    console.error('Error no controlado:', error)
    return response.status(500).json({
        message: 'Error interno del servidor',
        ok: false,
        status: 500
    })
}

export default errorHandler