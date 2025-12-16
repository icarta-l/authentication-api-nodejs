import BadRequestError from "../errors/BadRequestError";

export default class TypeValidator 
{
    public isString(testedVariable: any, variableName: string): boolean
    {
        if (typeof testedVariable !== "string") {
            let variableType: string = this.getVariableType(testedVariable);

            throw new BadRequestError(variableName + " needs to be of type \"string\", \"" + variableType + "\" given", variableName.toLowerCase().replaceAll(" ", "_") + "_type_is_not_string_but_" + variableType);
        }

        return true;
    }

    private getVariableType(testedVariable: any): string
    {
        let variableType: string = typeof testedVariable;

        if (testedVariable === null) {
            variableType = "null";
        }

        if (this.variableTypeIsArray(testedVariable)) {
            variableType = "array";
        }

        return variableType;
    }

    private variableTypeIsArray(testedVariable: any): boolean
    {
        return Array.isArray(testedVariable);
    }
}