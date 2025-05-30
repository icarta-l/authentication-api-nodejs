export default class AuthenticateUserResponse
{
    private _userIsLoggedIn!: boolean;
    private userId!: string;

    public userIsLoggedIn(): boolean
    {
        return this._userIsLoggedIn;
    }

    public setWetherUserSuccessfullyLoggedIn(userIsLoggedIn: boolean): AuthenticateUserResponse
    {
        this._userIsLoggedIn = userIsLoggedIn;

        return this;
    }

    public getUserId(): string
    {
        return this.userId;
    }

    public setUserId(userId: string): AuthenticateUserResponse
    {
        this.userId = userId;

        return this;
    }
}