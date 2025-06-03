import User from "../AuthenticateUserValueObject/User";

export default interface AuthenticateUserGateway
{
    retrieveUser(email: string): Promise<User|boolean>;
}