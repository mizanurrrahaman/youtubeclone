class ApiError extends Error {
    constructor(statusCode = 400, message="somethings went wrong ", errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors,
        this.status = false,
        this.data = null
    }
    
}

export default ApiError;











{/*
    class ApiError extends Error {
        constructor(statusCode = 400, message="somethings went wrong ", errors = null) {
            super(message);
            this.statusCode = statusCode;
            this.errors = errors,
            this.status = false,
            this.data = null
        }
        
    }
    
    export default ApiError;

*/}



{/*

    // constructor(message, statusCode) {
    //     super(message);
    //     this.statusCode = statusCode;
    // }

    class ApiError extends Error () {
        constructor(statusCode, message, errors = null) {
             super(message) 
             this.statusCode = statusCode,
             this.errors = errors,
             this.status = false,
             this.data = null
        }
    }
    
    export { ApiError }

*/}