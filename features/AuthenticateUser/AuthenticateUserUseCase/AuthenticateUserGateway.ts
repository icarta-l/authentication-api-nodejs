export default interface AuthenticateUserGateway
{
    authenticateUser(email: string, password: string): Promise<string|false>;
}