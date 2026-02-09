import TypeValidator from "../../../../../services/validation/TypeValidator";
import AuthenticateUserTypeValidation from "../../AuthenticateUserController/AuthenticateUserTypeValidation";

export default class AuthenticateUserTypeValidator implements AuthenticateUserTypeValidation {
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