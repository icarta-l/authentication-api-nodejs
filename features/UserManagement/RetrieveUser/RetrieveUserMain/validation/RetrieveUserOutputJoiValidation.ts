import Joi from "joi";
import type { Schema } from "joi";
import UserRetrievalOutputValidator from "../../RetrieveUserUseCase/UserRetrievalOutputValidator";

export default class RetrieveUserOutputJoiValidation implements UserRetrievalOutputValidator
{
    private _usernameHasAtLeast3Letters: Schema;
    private _usernameHasOnlyLettersNumberAndUnderscores: Schema;
    private _emailMustBeValid: Schema;
    private _firstNameHasLettersOnly: Schema;
    private _lastNameHasLettersOnly: Schema;
    
    constructor()
    {
        this._usernameHasAtLeast3Letters = Joi.string().pattern(/(.*[a-z]{1}.*){3,}/);
        this._usernameHasOnlyLettersNumberAndUnderscores = Joi.string().pattern(/^[a-zA-Z_0-9]{1,}$/);
        this._emailMustBeValid = Joi.string().email();
        this._firstNameHasLettersOnly = Joi.string().pattern(/^[a-zA-Z]{1,}$/);
        this._lastNameHasLettersOnly = Joi.string().pattern(/^[a-zA-Z]{1,}$/);
    }

    public async usernameHasAtLeat3Letters(username: string): Promise<boolean>
    {
        try {
            await this._usernameHasAtLeast3Letters.validateAsync(username);
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