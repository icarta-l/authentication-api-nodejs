import RetrieveUserResponse from "./RetrieveUserResponse";
import UserRetrievalOutput from "../RetrieveUserUseCase/UserRetrievalOutput";
import RetrieveUserOutput from "../RetrieveUserUseCase/RetrieveUserOutput";

export default class RetrieveUserPresenter implements RetrieveUserOutput
{
    private retrieveUserResponse!: RetrieveUserResponse;

    public getRetrieveUserResponse(): RetrieveUserResponse
    {
        return this.retrieveUserResponse;
    }
    
    public retrieveUserRetrievalOutput(userRetrievalOutput: UserRetrievalOutput): void
    {
        const retrieveUserResponse = new RetrieveUserResponse();

        retrieveUserResponse.setUsername(userRetrievalOutput.getUsername())
        .setEmail(userRetrievalOutput.getEmail())
        .setFirstName(userRetrievalOutput.getFirstName())
        .setLastName(userRetrievalOutput.getLastName())
        .setUserId(userRetrievalOutput.getUserId());

        this.retrieveUserResponse = retrieveUserResponse;
    }
}