export default class BadRequestError extends Error
{
    private code: string;

    constructor(message: string, code: string) {
        super(message);

        Object.setPrototypeOf(this, BadRequestError.prototype);

        this.code = code;
    }

    public getMessage(): string
    {
        return this.message;
    }

    public getErrorCode(): string
    {
        return this.code;
    }
}