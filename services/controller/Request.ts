export default class Request 
{
    private parameters: any;

    constructor()
    {
        this.parameters = {};
    }

    public addParameter(key: string, value: any): void
    {
        this.parameters.key = value;
    }

    public getParameters(): any
    {
        return this.parameters;
    }
}