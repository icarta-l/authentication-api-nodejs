import UpdateUserInformationResponse from "./UpdateUserInformationResponse";
import UserInformationUpdateOutput from "../UpdateUserInformationUseCase/UserInformationUpdateOutput";
import UpdateUserInformationOutput from "../UpdateUserInformationUseCase/UpdateUserInformationOutput";

export default class UpdateUserInformationPresenter implements UpdateUserInformationOutput
{
    private updateUserInformationResponse!: UpdateUserInformationResponse;

    public getUpdateUserInformationResponse(): UpdateUserInformationResponse
    {
        return this.updateUserInformationResponse;
    }
    
    public retrieveUserInformationUpdateOutput(userInformationUpdateOutput: UserInformationUpdateOutput): void
    {
        const updateUserInformationResponse = new UpdateUserInformationResponse();

        updateUserInformationResponse.setWetherTheUserInformationWereUpdated(userInformationUpdateOutput.userInformationWereUpdated());

        this.updateUserInformationResponse = updateUserInformationResponse;
    }
}