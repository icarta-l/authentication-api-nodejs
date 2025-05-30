export default class RegisterUserResponse 
{
    private _userIsRegistered!: boolean;

    public userIsRegistered(): boolean
    {
        return this._userIsRegistered;
    }

    public setWetherUserSuccessfullyRegistered(userIsRegistered: boolean): RegisterUserResponse
    {
        this._userIsRegistered = userIsRegistered;

        return this;
    }
}