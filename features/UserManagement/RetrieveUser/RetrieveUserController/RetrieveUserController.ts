import RetrieveUserRequest from "./RetrieveUserRequest";
import RetrieveUserResponse from "./RetrieveUserResponse";
import RetrieveUserGateway from "../RetrieveUserUseCase/RetrieveUserGateway";
import UserRetrievalInputValidator from "../RetrieveUserUseCase/UserRetrievalInputValidator";
import UserRetrievalOutputValidator from "../RetrieveUserUseCase/UserRetrievalOutputValidator";
import UserRetrievalOutput from "../RetrieveUserUseCase/UserRetrievalOutput";
import RetrieveUserUseCase from "../RetrieveUserUseCase/RetrieveUserUseCase";
import UserRetrievalInput from "../RetrieveUserUseCase/UserRetrievalInput";
import RetrieveUserInput from "../RetrieveUserUseCase/RetrieveUserInput";
import RetrieveUserPresenter from "./RetrieveUserPresenter";

export default class RetrieveUserController implements RetrieveUserInput
{
    public async handleRetrieveUserRequest(retrieveUserRequest: RetrieveUserRequest, retrieveUserGateway: RetrieveUserGateway, userRetrievalInputValidator: UserRetrievalInputValidator, userRetrievalOutputValidator: UserRetrievalOutputValidator): Promise<RetrieveUserResponse>
    {
        const userRetrievalInput: UserRetrievalInput = await this.composeUserRetrievalInput(retrieveUserRequest, userRetrievalInputValidator);
        const userRetrievalOutput: UserRetrievalOutput = await this.retrieveUser(userRetrievalInput, retrieveUserGateway, userRetrievalOutputValidator);

        const retrieveUserPresenter: RetrieveUserPresenter = new RetrieveUserPresenter();
        retrieveUserPresenter.retrieveUserRetrievalOutput(userRetrievalOutput);

        return retrieveUserPresenter.getRetrieveUserResponse();
    }

    public async retrieveUser(userRetrievalInput: UserRetrievalInput, retrieveUserGateway: RetrieveUserGateway, userRetrievalOutputValidator: UserRetrievalOutputValidator): Promise<UserRetrievalOutput>
    {
        const retrieveUserUseCase: RetrieveUserUseCase = new RetrieveUserUseCase();
        const userRetrievalOutput: UserRetrievalOutput = await retrieveUserUseCase.retrieveUser(userRetrievalInput, retrieveUserGateway);

        return userRetrievalOutput;
    }

    private async composeUserRetrievalInput(retrieveUserRequest: RetrieveUserRequest, userRetrievalInputValidator: UserRetrievalInputValidator): Promise<UserRetrievalInput>
    {
        const userRetrievalInput: UserRetrievalInput = new UserRetrievalInput(userRetrievalInputValidator);
        await userRetrievalInput.setRequestedUserId(retrieveUserRequest.getRequestedUserId());

        return userRetrievalInput;
    }
}