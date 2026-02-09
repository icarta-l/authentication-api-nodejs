export default class UpdateUserPasswordResponse
{
    private _userPasswordWasUpdated!: boolean;

    public userPasswordWasUpdated(): boolean
    {
        return this._userPasswordWasUpdated;
    }

    public setWetherTheUserPasswordWasUpdated(userPasswordWasUpdated: boolean): UpdateUserPasswordResponse
    {
        this._userPasswordWasUpdated = userPasswordWasUpdated;

        return this;
    }
}