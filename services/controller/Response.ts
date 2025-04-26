export default class Response 
{
    private elements: any;

    constructor()
    {
        this.elements = {};
    }

    public addElement(key: string, value: any): void
    {
        this.elements.key = value;
    }

    public getElements(): any
    {
        return this.elements;
    }
}