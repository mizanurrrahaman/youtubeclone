class Apirespose {
    constructor(statusCode, message, data = []) {
        this.statusCode = statusCode,
        this.message = message,
        this.data = data,
        this.status = statusCode <300
    }
}

export {Apirespose}