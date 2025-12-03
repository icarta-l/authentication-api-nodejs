import UserInformationUpdateInput from "../UpdateUserInformationUseCase/UserInformationUpdateInput";
import UpdateUserInformationUseCase from "../UpdateUserInformationUseCase/UpdateUserInformationUseCase";
import UpdateUserInformationPresenter from "./UpdateUserInformationPresenter";
import UpdateUserInformationInput from "../UpdateUserInformationUseCase/UpdateUserInformationInput";
import UpdateUserInformationRequest from "./UpdateUserInformationRequest";
import UpdateUserInformationResponse from "./UpdateUserInformationResponse";
import UserInformationUpdateOutput from "../UpdateUserInformationUseCase/UserInformationUpdateOutput";
import UpdateUserInformationGateway from "../UpdateUserInformationUseCase/UpdateUserInformationGateway";
import UserInformationUpdateInputValidator from "../UpdateUserInformationUseCase/UserInformationUpdateInputValidator";

export default class UpdateUserInformationController implements UpdateUserInformationInput
{
    public async handleUpdateUserInformationRequest(updateUserInformationRequest: UpdateUserInformationRequest, updateUserInformationGateway: UpdateUserInformationGateway, userInformationUpdateInputValidator: UserInformationUpdateInputValidator): Promise<UpdateUserInformationResponse>
    {
        const userInformationUpdateInput: UserInformationUpdateInput = await this.composeUserInformationUpdateInput(updateUserInformationRequest, userInformationUpdateInputValidator);
        const userInformationUpdateOutput: UserInformationUpdateOutput = await this.updateUserInformation(userInformationUpdateInput, updateUserInformationGateway);

        const updateUserInformationPresenter: UpdateUserInformationPresenter = new UpdateUserInformationPresenter();
        updateUserInformationPresenter.retrieveUserInformationUpdateOutput(userInformationUpdateOutput);

        return updateUserInformationPresenter.getUpdateUserInformationResponse();
    }

    public async updateUserInformation(userInformationUpdateInput: UserInformationUpdateInput, updateUserInformationGateway: UpdateUserInformationGateway, ): Promise<UserInformationUpdateOutput>
    {
        const updateUserInformationUseCase: UpdateUserInformationUseCase = new UpdateUserInformationUseCase();
        const userInformationUpdateOutput: UserInformationUpdateOutput = await updateUserInformationUseCase.updateUserInformation(userInformationUpdateInput, updateUserInformationGateway);

        return userInformationUpdateOutput;
    }

    private async composeUserInformationUpdateInput(updateUserInformationRequest: UpdateUserInformationRequest, userInformationUpdateInputValidator: UserInformationUpdateInputValidator): Promise<UserInformationUpdateInput>
    {
        const userInformationUpdateInput: UserInformationUpdateInput = new UserInformationUpdateInput(userInformationUpdateInputValidator);
        await userInformationUpdateInput.setUserId(updateUserInformationRequest.getUserId());
        await userInformationUpdateInput.setUpdatedUserId(updateUserInformationRequest.getUpdatedUserId());
        await userInformationUpdateInput.setFirstName(updateUserInformationRequest.getFirstName());
        await userInformationUpdateInput.setLastName(updateUserInformationRequest.getLastName());

        return userInformationUpdateInput;
    }
}