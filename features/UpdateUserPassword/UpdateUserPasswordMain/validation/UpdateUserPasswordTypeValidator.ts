import UpdateUserPasswordTypeValidation from "../../UpdateUserPasswordController/UpdateUserPasswordTypeValidation"
import TypeValidator from "../../../../services/validation/TypeValidator";

export default class UpdateUserPasswordTypeValidator implements UpdateUserPasswordTypeValidation {
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