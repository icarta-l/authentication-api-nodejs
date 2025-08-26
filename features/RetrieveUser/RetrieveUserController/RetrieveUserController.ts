import RetrieveUserRequest from "./RetrieveUserRequest";
import RetrieveUserResponse from "./RetrieveUserResponse";
import RetrieveUserGateway from "../RetrieveUserUseCase/RetrieveUserGateway";
import UserRetrievalInputValidator from "../RetrieveUserUseCase/UserRetrievalInputValidator";
import UserRetrievalOutput from "../RetrieveUserUseCase/UserRetrievalOutput";

export default class RetrieveUserController
{
    public async handleRetrieveUserRequest(retrieveUserRequest: RetrieveUserRequest, retrieveUserGateway: RetrieveUserGateway, userRetrievalInputValidator: UserRetrievalInputValidator): Promise<RetrieveUserResponse>
    {
        const userRetrievalOutput: UserRetrievalOutput|false = await retrieveUserGateway.retrieveUser(retrieveUserRequest.getRequestedUserId());

        if (!userRetrievalOutput) {
            throw new Error("Couldn't retrieve user");
        }

        const retrieveUserResponse = new RetrieveUserResponse();
        retrieveUserResponse.setUsername(userRetrievalOutput.getUsername())
        .setEmail(userRetrievalOutput.getEmail())
        .setFirstName(userRetrievalOutput.getFirstName())
        .setLastName(userRetrievalOutput.getLastName())
        .setUserId(userRetrievalOutput.getUserId());
        
        return retrieveUserResponse;
    }
}