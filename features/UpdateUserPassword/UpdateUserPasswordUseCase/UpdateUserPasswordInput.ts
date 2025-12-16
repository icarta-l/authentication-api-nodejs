import UserPasswordUpdateInput from "./UserPasswordUpdateInput";
import UpdateUserPasswordGateway from "./UpdateUserPasswordGateway";
import UserPasswordUpdateOutput from "./UserPasswordUpdateOutput";

export default interface UpdateUserPasswordInput
{
    updateUserPassword(userPasswordUpdateInput: UserPasswordUpdateInput, updateUserPasswordGateway: UpdateUserPasswordGateway): Promise<UserPasswordUpdateOutput>
}