import UserPasswordUpdateInput from "./UserPasswordUpdateInput";
import UserPasswordUpdateOutput from "./UserPasswordUpdateOutput";

export default interface UpdateUserPasswordGateway
{
    updateUserPassword(userPasswordUpdateInput: UserPasswordUpdateInput): Promise<UserPasswordUpdateOutput>;
    originalPasswordMatches(userId: string, originalPassword: string): Promise<boolean>;
    getUserRole(userId: string): Promise<string|false>;
}