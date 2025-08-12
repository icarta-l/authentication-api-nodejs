import RetrieveUserGateway from "./RetrieveUserGateway";
import UserRetrievalOutputValidator from "./UserRetrievalOutputValidator";
import UserRetrievalOutput from "./UserRetrievalOutput";
import UserRetrievalInput from "./UserRetrievalInput";
import UnauthorisedActionError from "../../../services/errors/UnauthorisedActionError";

export default class RetrieveUserUseCase 
{
    public async retrieveUser(userRetrievalInput: UserRetrievalInput, retrieveUserGateway: RetrieveUserGateway, userRetrievalOutputValidator: UserRetrievalOutputValidator): Promise<UserRetrievalOutput>
    {
        const userRetrievalOutput: UserRetrievalOutput|false = await retrieveUserGateway.retrieveUser(userRetrievalInput.getRequestedUserId());
        
        if (!userRetrievalOutput) {
            throw new UnauthorisedActionError("Requested user could not be retrieved");
        }

        return userRetrievalOutput;
    }
}