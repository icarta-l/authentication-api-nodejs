import Joi from "joi";
import type { Schema } from "joi";
import UserRetrievalInputValidator from "../../RetrieveUserUseCase/UserRetrievalInputValidator";

export default class RetrieveUserInputJoiValidation implements UserRetrievalInputValidator
{
    private _userIdMustBeValid: Schema;
    
    constructor()
    {
        this._userIdMustBeValid = Joi.string().alphanum();
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
}