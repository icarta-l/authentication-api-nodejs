import UserInformationUpdateInput from "./UserInformationUpdateInput";
import UserInformationUpdateOutput from "./UserInformationUpdateOutput";
import UpdateUserInformationGateway from "./UpdateUserInformationGateway";
import UserInformationUpdateInputValidator from "./UserInformationUpdateInputValidator";

export default interface UpdateUserInformationInput
{
    updateUserInformation(userInformationUpdateInput: UserInformationUpdateInput, updateUserInformationGateway: UpdateUserInformationGateway, userInformationUpdateInputValidator: UserInformationUpdateInputValidator): Promise<UserInformationUpdateOutput>
}