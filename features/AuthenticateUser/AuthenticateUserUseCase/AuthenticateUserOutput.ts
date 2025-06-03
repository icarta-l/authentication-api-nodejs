export default class UserAuthenticationOutput
{
    private _userIsLoggedIn!: boolean;
    private userId!: number;

    public userIsLoggedIn(): boolean
    {
        return this._userIsLoggedIn;
    }

    public setWetherUserSuccessfullyLoggedIn(userIsLoggedIn: boolean): UserAuthenticationOutput
    {
        this._userIsLoggedIn = userIsLoggedIn;

        return this;
    }

    public getUserId(): number
    {
        return this.userId;
    }

    public setUserId(userId: number): UserAuthenticationOutput
    {
        this.userId = userId;

        return this;
    }
}