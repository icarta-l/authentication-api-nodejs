import TypeValidator from "../../../../services/validation/TypeValidator";
import RegisterUserTypeValidation from "../../RegisterUserController/RegisterUserTypeValidation";

export default class RegisterUserTypeValidator implements RegisterUserTypeValidation {
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