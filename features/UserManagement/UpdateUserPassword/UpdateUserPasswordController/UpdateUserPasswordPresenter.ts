import UpdateUserPasswordResponse from "./UpdateUserPasswordResponse";
import UserPasswordUpdateOutput from "../UpdateUserPasswordUseCase/UserPasswordUpdateOutput";
import UpdateUserPasswordOutput from "../UpdateUserPasswordUseCase/UpdateUserPasswordOutput";

export default class UpdateUserPasswordPresenter implements UpdateUserPasswordOutput
{
    private updateUserPasswordResponse!: UpdateUserPasswordResponse;

    public getUpdateUserPasswordResponse(): UpdateUserPasswordResponse
    {
        return this.updateUserPasswordResponse;
    }
    
    public retrieveUserPasswordUpdateOutput(userPasswordUpdateOutput: UserPasswordUpdateOutput): void
    {
        const updateUserPasswordResponse = new UpdateUserPasswordResponse();

        updateUserPasswordResponse.setWetherTheUserPasswordWasUpdated(userPasswordUpdateOutput.userPasswordWasUpdated());

        this.updateUserPasswordResponse = updateUserPasswordResponse;
    }
}