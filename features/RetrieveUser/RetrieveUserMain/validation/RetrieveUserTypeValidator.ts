import TypeValidator from "../../../../services/validation/TypeValidator";
import RetrieveUserTypeValidation from "../../RetrieveUserController/RetrieveUserTypeValidation";

export default class RetrieveUserTypeValidator implements RetrieveUserTypeValidation {
    private typeValidator: TypeValidator

    constructor(typeValidator: TypeValidator)
    {
        this.typeValidator = typeValidator;
    }

    public isString(testedVariable: any, variableName: string): boolean
    {
        return this.typeValidator.isString(testedVariable, variableName);
    }
}