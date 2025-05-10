import Joi from "joi";
import type { Schema } from "joi";
import UserRegistrationInputValidator from "../../RegisterUserUseCase/UserRegistrationInputValidator";

export default class JoiValidation implements UserRegistrationInputValidator
{
    private usernameHasAtLeastThreeLettersSchema!: Schema;

    constructor()
    {
        this.usernameHasAtLeastThreeLettersSchema = Joi.string().pattern(/.*[a-zA-Z]{3}.*/);
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
}