export default class UserPasswordUpdateOutput
{
    private _userPasswordWasUpdated!: boolean;

    public userPasswordWasUpdated(): boolean
    {
        return this._userPasswordWasUpdated;
    }

    public setWetherTheUserPasswordWasUpdated(userPasswordWasUpdated: boolean): UserPasswordUpdateOutput
    {
        this._userPasswordWasUpdated = userPasswordWasUpdated;

        return this;
    }
}