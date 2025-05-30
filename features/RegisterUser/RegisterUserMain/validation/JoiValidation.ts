import Joi from "joi";
import type { Schema } from "joi";
import UserRegistrationInputValidator from "../../RegisterUserUseCase/UserRegistrationInputValidator";

export default class JoiValidation implements UserRegistrationInputValidator
{
    private _usernameHasAtLeast3Letters: Schema;
    private _usernameHasOnlyLettersNumberAndUnderscores: Schema;
    private _emailMustBeValid: Schema;
    private _passwordMustBeAtLeast12CharactersLong: Schema;
    private _passwordMustHaveAtLeast3LowercaseLetters: Schema;
    private _passwordMustHaveAtLeast3UppercaseLetters: Schema;
    private _passwordMustHaveAtLeast3Symbols: Schema;
    private _passwordMustHaveAtLeast3Numbers: Schema;

    constructor()
    {
        this._usernameHasAtLeast3Letters = Joi.string().pattern(/(.*[a-z]{1}.*){3,}/);
        this._usernameHasOnlyLettersNumberAndUnderscores = Joi.string().pattern(/^[a-zA-Z_0-9]{1,}$/);
        this._emailMustBeValid = Joi.string().email();
        this._passwordMustBeAtLeast12CharactersLong = Joi.string().min(12);
        this._passwordMustHaveAtLeast3LowercaseLetters = Joi.string().pattern(/(.*[a-z]{1}.*){3,}/);
        this._passwordMustHaveAtLeast3UppercaseLetters = Joi.string().pattern(/(.*[A-Z]{1}.*){3,}/);
        this._passwordMustHaveAtLeast3Symbols = Joi.string().pattern(/(.*[~`!@#$%^&*()_\-+={[}\]\|\\\:;\"'<,>\.\?\/\ ]{1}.*){3,}/);
        this._passwordMustHaveAtLeast3Numbers = Joi.string().pattern(/(.*[0-9]{1}.*){3,}/);
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