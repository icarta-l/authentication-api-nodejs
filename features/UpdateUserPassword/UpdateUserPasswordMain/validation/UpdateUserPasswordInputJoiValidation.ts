import Joi from "joi";
import type { Schema } from "joi";

import UserPasswordUpdateInputValidator from "../../UpdateUserPasswordUseCase/UserPasswordUpdateInputValidator";

export default class UpdateUserPasswordInputJoiValidation implements UserPasswordUpdateInputValidator
{
    private _userIdMustBeValid: Schema;
    private _passwordMustBeAtLeast12CharactersLong: Schema;
    private _passwordMustHaveAtLeast3LowercaseLetters: Schema;
    private _passwordMustHaveAtLeast3UppercaseLetters: Schema;
    private _passwordMustHaveAtLeast3Symbols: Schema;
    private _passwordMustHaveAtLeast3Numbers: Schema;

    constructor()
    {
        this._userIdMustBeValid = Joi.string().alphanum();
        this._passwordMustBeAtLeast12CharactersLong = Joi.string().min(12);
        this._passwordMustHaveAtLeast3LowercaseLetters = Joi.string().pattern(/(.*[a-z]{1}.*){3,}/);
        this._passwordMustHaveAtLeast3UppercaseLetters = Joi.string().pattern(/(.*[A-Z]{1}.*){3,}/);
        this._passwordMustHaveAtLeast3Symbols = Joi.string().pattern(/(.*[~`!@#$%^&*()_\-+={[}\]\|\\\:;\"'<,>\.\?\/\ ]{1}.*){3,}/);
        this._passwordMustHaveAtLeast3Numbers = Joi.string().pattern(/(.*[0-9]{1}.*){3,}/);
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

    public async passwordMustBeAtLeast12CharactersLong(password: string): Promise<boolean>
    {
        try {
            await this._passwordMustBeAtLeast12CharactersLong.validateAsync(password);
        } catch (error) {
            return false;
        }

        return true;
    }

    public async passwordMustHaveAtLeast3LowercaseLetters(password: string): Promise<boolean>
    {
        try {
            await this._passwordMustHaveAtLeast3LowercaseLetters.validateAsync(password);
        } catch (error) {
            return false;
        }

        return true;
    }

    public async passwordMustHaveAtLeast3UppercaseLetters(password: string): Promise<boolean>
    {
        try {
            await this._passwordMustHaveAtLeast3UppercaseLetters.validateAsync(password);
        } catch (error) {
            return false;
        }

        return true;
    }

    public async passwordMustHaveAtLeast3Symbols(password: string): Promise<boolean>
    {
        try {
            await this._passwordMustHaveAtLeast3Symbols.validateAsync(password);
        } catch (error) {
            return false;
        }

        return true;
    }

    public async passwordMustHaveAtLeast3Numbers(password: string): Promise<boolean>
    {
        try {
            await this._passwordMustHaveAtLeast3Numbers.validateAsync(password);
        } catch (error) {
            return false;
        }

        return true;
    }
}