export default class UserInformationUpdateOutput
{
    private _userInformationWereUpdated!: boolean;

    public userInformationWereUpdated(): boolean
    {
        return this._userInformationWereUpdated;
    }

    public setWetherTheUserInformationWereUpdated(userInformationWereUpdated: boolean): UserInformationUpdateOutput
    {
        this._userInformationWereUpdated = userInformationWereUpdated;

        return this;
    }
}