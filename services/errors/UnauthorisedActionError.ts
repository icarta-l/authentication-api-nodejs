export default class UnauthorisedActionError extends Error
{
    private code: string;

    constructor(message: string, code: string) {
        super(message);

        Object.setPrototypeOf(this, UnauthorisedActionError.prototype);

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