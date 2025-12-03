import UserInformationUpdateInput from "./UserInformationUpdateInput";
import UpdateUserInformationGateway from "./UpdateUserInformationGateway";
import UserInformationUpdateOutput from "./UserInformationUpdateOutput";
import UnauthorisedActionError from "../../../services/errors/UnauthorisedActionError";

export default class UpdateUserInformationUseCase 
{
    public async updateUserInformation(userInformationUpdateInput: UserInformationUpdateInput, updateUserInformationGateway: UpdateUserInformationGateway): Promise<UserInformationUpdateOutput>
    {
        if (await this.checkWeatherUserIsAllowedToUpdateUserInformation(userInformationUpdateInput, updateUserInformationGateway)) {
            const userInformationUpdateOutput: UserInformationUpdateOutput = await updateUserInformationGateway.updateUserInformation(userInformationUpdateInput);

            return userInformationUpdateOutput;
        }

        throw new Error("Couldn't update user information");
    }
    
    private async checkWeatherUserIsAllowedToUpdateUserInformation(userInformationUpdateInput: UserInformationUpdateInput, updateUserInformationGateway: UpdateUserInformationGateway): Promise<boolean>
    {
        switch (await updateUserInformationGateway.getUserRole(userInformationUpdateInput.getUserId())) {
            case "User":
                if (userInformationUpdateInput.getUserId() !== userInformationUpdateInput.getUpdatedUserId()) {
                    throw new UnauthorisedActionError("Cannot update another user");
                }
                
                return true;
            
            default:
                throw new UnauthorisedActionError("User role was not recognised");
        }
    }
}