export default class UserAuthenticationOutput
{
    private _userIsLoggedIn!: boolean;
    private userId!: string;

    public userIsLoggedIn(): boolean
    {
        return this._userIsLoggedIn;
    }

    public setWetherUserSuccessfullyLoggedIn(userIsLoggedIn: boolean): UserAuthenticationOutput
    {
        this._userIsLoggedIn = userIsLoggedIn;

        return this;
    }

    public getUserId(): string
    {
        return this.userId;
    }

    public setUserId(userId: string): UserAuthenticationOutput
    {
        this.userId = userId;

        return this;
    }
}