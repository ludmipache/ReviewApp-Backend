function validateBody(rules) {
    return (request, response, next) => {
        const errors = []

        for (const field in rules) {
            const rule = rules[field]
            const value = request.body[field]

            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(`El campo '${field}' es obligatorio`)
                continue
            }

            if (value !== undefined && rule.type) {
                const actual_type = typeof value
                if (rule.type === 'number' && Number.isNaN(Number(value))) {
                    errors.push(`El campo '${field}' debe ser un numero`)
                } else if (rule.type !== 'number' && actual_type !== rule.type) {
                    errors.push(`El campo '${field}' debe ser de tipo ${rule.type}`)
                }
            }
        }

        if (errors.length > 0) {
            return response.status(400).json({
                message: errors.join(' | '),
                ok: false,
                status: 400
            })
        }

        return next()
    }
}

export default validateBody