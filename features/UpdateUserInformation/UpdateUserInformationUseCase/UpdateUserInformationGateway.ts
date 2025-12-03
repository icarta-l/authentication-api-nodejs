import UserInformationUpdateInput from "./UserInformationUpdateInput";
import UserInformationUpdateOutput from "./UserInformationUpdateOutput";

export default interface UpdateUserInformationGateway
{
    updateUserInformation(userInformationUpdateInput: UserInformationUpdateInput): Promise<UserInformationUpdateOutput>;
    getUserRole(userId: string): Promise<string|false>;
}