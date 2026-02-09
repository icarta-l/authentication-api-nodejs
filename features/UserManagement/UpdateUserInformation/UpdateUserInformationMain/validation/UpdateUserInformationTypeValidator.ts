import UpdateUserInformationTypeValidation from "../../UpdateUserInformationController/UpdateUserInformationTypeValidation"
import TypeValidator from "../../../../../services/validation/TypeValidator";

export default class UpdateUserInformationTypeValidator implements UpdateUserInformationTypeValidation {
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