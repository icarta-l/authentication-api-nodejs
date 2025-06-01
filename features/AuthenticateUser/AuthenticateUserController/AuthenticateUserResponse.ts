export default class AuthenticateUserResponse
{
    private _userIsLoggedIn!: boolean;

    public userIsLoggedIn(): boolean
    {
        return this._userIsLoggedIn;
    }

    public setWetherUserSuccessfullyLoggedIn(userIsLoggedIn: boolean): AuthenticateUserResponse
    {
        this._userIsLoggedIn = userIsLoggedIn;

        return this;
    }
}