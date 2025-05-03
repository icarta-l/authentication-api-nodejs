export default class UnauthorisedActionError extends Error
{
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, UnauthorisedActionError.prototype);
    }

    public getMessage(): string
    {
        return this.message;
    }
}