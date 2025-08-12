import UserRetrievalInput from "./UserRetrievalInput";
import RetrieveUserGateway from "./RetrieveUserGateway";
import UserRetrievalOutputValidator from "./UserRetrievalOutputValidator";
import UserRetrievalOutput from "./UserRetrievalOutput";

export default interface RetrieveUserInput
{
    retrieveUser(userRetrievalInput: UserRetrievalInput, retrieveUserGateway: RetrieveUserGateway, userRetrievalOutputValidator: UserRetrievalOutputValidator): Promise<UserRetrievalOutput>
}