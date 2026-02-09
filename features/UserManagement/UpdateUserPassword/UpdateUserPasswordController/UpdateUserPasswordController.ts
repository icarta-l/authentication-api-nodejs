import UserPasswordUpdateInput from "../UpdateUserPasswordUseCase/UserPasswordUpdateInput";
import UpdateUserPasswordInput from "../UpdateUserPasswordUseCase/UpdateUserPasswordInput";
import UserPasswordUpdateOutput from "../UpdateUserPasswordUseCase/UserPasswordUpdateOutput";
import UpdateUserPasswordRequest from "./UpdateUserPasswordRequest";
import UpdateUserPasswordResponse from "./UpdateUserPasswordResponse";
import UpdateUserPasswordGateway from "../UpdateUserPasswordUseCase/UpdateUserPasswordGateway";
import UserPasswordUpdateInputValidator from "../UpdateUserPasswordUseCase/UserPasswordUpdateInputValidator";
import UpdateUserPasswordPresenter from "./UpdateUserPasswordPresenter";
import UpdateUserPasswordUseCase from "../UpdateUserPasswordUseCase/UpdateUserPasswordUseCase";

export default class UpdateUserPasswordController implements UpdateUserPasswordInput
{
    public async handleUpdateUserPasswordRequest(updateUserPasswordRequest: UpdateUserPasswordRequest, updateUserPasswordGateway: UpdateUserPasswordGateway, userPasswordUpdateInputValidator: UserPasswordUpdateInputValidator): Promise<UpdateUserPasswordResponse>
    {
        const userPasswordUpdateInput: UserPasswordUpdateInput = await this.composeUserPasswordUpdateInput(updateUserPasswordRequest, userPasswordUpdateInputValidator);
        const userPasswordUpdateOutput: UserPasswordUpdateOutput = await this.updateUserPassword(userPasswordUpdateInput, updateUserPasswordGateway);

        const updateUserPasswordPresenter: UpdateUserPasswordPresenter = new UpdateUserPasswordPresenter();
        updateUserPasswordPresenter.retrieveUserPasswordUpdateOutput(userPasswordUpdateOutput);

        return updateUserPasswordPresenter.getUpdateUserPasswordResponse();
    }

    public async updateUserPassword(userPasswordUpdateInput: UserPasswordUpdateInput, updateUserPasswordGateway: UpdateUserPasswordGateway): Promise<UserPasswordUpdateOutput>
    {
        const updateUserPasswordUseCase: UpdateUserPasswordUseCase = new UpdateUserPasswordUseCase();
        const userPasswordUpdateOutput: UserPasswordUpdateOutput = await updateUserPasswordUseCase.updateUserPassword(userPasswordUpdateInput, updateUserPasswordGateway);

        return userPasswordUpdateOutput;
    }

    private async composeUserPasswordUpdateInput(updateUserPasswordRequest: UpdateUserPasswordRequest, userPasswordUpdateInputValidator: UserPasswordUpdateInputValidator): Promise<UserPasswordUpdateInput>
    {
        const userPasswordUpdateInput: UserPasswordUpdateInput = new UserPasswordUpdateInput(userPasswordUpdateInputValidator);
        await userPasswordUpdateInput.setUserId(updateUserPasswordRequest.getUserId());
        await userPasswordUpdateInput.setUpdatedUserId(updateUserPasswordRequest.getUpdatedUserId());
        await userPasswordUpdateInput.setOrignalPassword(updateUserPasswordRequest.getOrignalPassword());
        await userPasswordUpdateInput.setChangedPassword(updateUserPasswordRequest.getChangedPassword());
        await userPasswordUpdateInput.setChangedPasswordConfirmation(updateUserPasswordRequest.getChangedPasswordConfirmation());

        return userPasswordUpdateInput;
    }
}