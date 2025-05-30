import Joi from "joi";
import type { Schema } from "joi";
import UserAuthenticationInputValidator from "../../AuthenticateUserUseCase/UserAuthenticationInputValidator";

export default class JoiValidation implements UserAuthenticationInputValidator
{
    private _emailMustBeValid: Schema;

    constructor()
    {
        this._emailMustBeValid = Joi.string().email();
    }

    public async emailMustBeValid(email: string): Promise<boolean>
    {
        try {
            await this._emailMustBeValid.validateAsync(email);
        } catch (error) {
            return false;
        }

        return true;
    }
}