export default class UpdateUserInformationResponse
{
    private _userInformationWereUpdated!: boolean;

    public userInformationWereUpdated(): boolean
    {
        return this._userInformationWereUpdated;
    }

    public setWetherTheUserInformationWereUpdated(userInformationWereUpdated: boolean): UpdateUserInformationResponse
    {
        this._userInformationWereUpdated = userInformationWereUpdated;

        return this;
    }
}