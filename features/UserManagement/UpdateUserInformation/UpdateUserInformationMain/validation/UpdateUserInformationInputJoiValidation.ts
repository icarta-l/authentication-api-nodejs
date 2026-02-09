import Joi from "joi";
import type { Schema } from "joi";
import UserInformationUpdateInputValidator from "../../UpdateUserInformationUseCase/UserInformationUpdateInputValidator";

export default class UpdateUserInformationInputJoiValidation implements UserInformationUpdateInputValidator
{
    private _userIdMustBeValid: Schema;
    private _firstNameHasLettersOnly: Schema;
    private _lastNameHasLettersOnly: Schema;
    
    constructor()
    {
        this._userIdMustBeValid = Joi.string().alphanum();
        this._firstNameHasLettersOnly = Joi.string().pattern(/^[a-zA-Z]{1,}$/);
        this._lastNameHasLettersOnly = Joi.string().pattern(/^[a-zA-Z]{1,}$/);
    }

    public async userIdIsValid(userId: string): Promise<boolean>
    {
        try {
            await this._userIdMustBeValid.validateAsync(userId);
        } catch (error) {
            return false;
        }

        return true;
    }

    public async firstNameHasLettersOnly(firstName: string): Promise<boolean>
    {
        try {
            await this._firstNameHasLettersOnly.validateAsync(firstName);
        } catch (error) {
            return false;
        }

        return true;
    }

    public async lastNameHasLettersOnly(lastName: string): Promise<boolean>
    {
        try {
            await this._lastNameHasLettersOnly.validateAsync(lastName);
        } catch (error) {
            return false;
        }

        return true;
    }
}