export default class InvalidRetrievedValuesError extends Error
{
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, InvalidRetrievedValuesError.prototype);
    }

    public getMessage(): string
    {
        return this.message;
    }
}