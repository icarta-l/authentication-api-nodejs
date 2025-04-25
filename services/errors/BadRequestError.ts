export default class BadRequestError extends Error
{
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    public getMessage(): string
    {
        return this.message;
    }
}