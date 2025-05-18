import Joi from "joi";
import type { Schema } from "joi";
import UserRegistrationInputValidator from "../../RegisterUserUseCase/UserRegistrationInputValidator";

export default class JoiValidation implements UserRegistrationInputValidator
{
    private usernameHasAtLeastThreeLettersSchema: Schema;
    private _usernameHasOnlyLettersNumberAndUnderscores: Schema;
    private _emailMustBeValid: Schema;
    private _passwordMustBeAtLeast12CharactersLong: Schema;

    constructor()
    {
        this.usernameHasAtLeastThreeLettersSchema = Joi.string().pattern(/.*[a-zA-Z]{3}.*/);
        this._usernameHasOnlyLettersNumberAndUnderscores = Joi.string().pattern(/^[a-zA-Z_0-9]{1,}$/);
        this._emailMustBeValid = Joi.string().email();
        this._passwordMustBeAtLeast12CharactersLong = Joi.string().min(12);
    }

    public async usernameHasAtLeat3Letters(username: string): Promise<boolean>
    {
        try {
            await this.usernameHasAtLeastThreeLettersSchema.validateAsync(username);
        } catch (error) {
            return false;
        }

        return true;
    }

    public async usernameHasOnlyLettersNumberAndUnderscores(username: string): Promise<boolean>
    {
        try {
            await this._usernameHasOnlyLettersNumberAndUnderscores.validateAsync(username);
        } catch (error) {
            return false;
        }

        return true;
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

    public async passwordMustBeAtLeast12CharactersLong(password: string): Promise<boolean>
    {
        try {
            await this._passwordMustBeAtLeast12CharactersLong.validateAsync(password);
        } catch (error) {
            return false;
        }

        return true;
    }
}