export default class UserRegistrationOutput {
    private _userIsRegistered!: boolean;

    public userIsRegistered(): boolean 
    {
        return this._userIsRegistered;
    }

    public setWetherUserSuccessfullyRegistered(userIsRegistered: boolean): UserRegistrationOutput
    {
        this._userIsRegistered = userIsRegistered;

        return this;
    }
}