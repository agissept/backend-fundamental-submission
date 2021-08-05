class ClientError extends Error {
    private statusCode: number;

    constructor(message: string, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ClientError';
    }
}
export default ClientError
