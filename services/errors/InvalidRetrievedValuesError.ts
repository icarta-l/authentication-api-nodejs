export default class InvalidRetrievedValuesError extends Error
{
    private code: string;

    constructor(message: string, code: string) {
        super(message);

        Object.setPrototypeOf(this, InvalidRetrievedValuesError.prototype);

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