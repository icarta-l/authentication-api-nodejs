export default class AuthenticateUserResponse
{
    private _userIsLoggedIn!: boolean;
    private userId!: number;

    public userIsLoggedIn(): boolean
    {
        return this._userIsLoggedIn;
    }

    public setWetherUserSuccessfullyLoggedIn(userIsLoggedIn: boolean): AuthenticateUserResponse
    {
        this._userIsLoggedIn = userIsLoggedIn;

        return this;
    }

    public getUserId(): number
    {
        return this.userId;
    }

    public setUserId(userId: number): AuthenticateUserResponse
    {
        this.userId = userId;

        return this;
    }
}