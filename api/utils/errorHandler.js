export const errorHandler = (statusCode,errorMessage) =>{
    const error = new Error();
    error.message = errorMessage;
    error.statusCode = statusCode
    return error
}