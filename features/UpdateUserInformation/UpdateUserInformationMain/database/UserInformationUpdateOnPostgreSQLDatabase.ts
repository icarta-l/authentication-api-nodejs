import PostgreSQLDatabase from "../../../../services/database/PostgreSQLDatabase";
import type { QueryResult } from "pg";

import UpdateUserInformationGateway from "../../UpdateUserInformationUseCase/UpdateUserInformationGateway";
import UserInformationUpdateInput from "../../UpdateUserInformationUseCase/UserInformationUpdateInput";
import UserInformationUpdateOutput from "../../UpdateUserInformationUseCase/UserInformationUpdateOutput";

export default class UserInformationUpdateOnPostgreSQLDatabase implements UpdateUserInformationGateway
{
    private postgreSQLDatabase: PostgreSQLDatabase;

    constructor() {
        this.postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    }

    public async connect(): Promise<void> 
    {
        await this.postgreSQLDatabase.connect();
    }

    public async close(): Promise<void> 
    {
        await this.postgreSQLDatabase.close();
    }

    public async query(query: string, values?: Array<any>): Promise<any>
    {
        return await this.postgreSQLDatabase.query(query, values);
    }

    public async updateUserInformation(userInformationUpdateInput: UserInformationUpdateInput): Promise<UserInformationUpdateOutput>
    {
        const queryResult: QueryResult|undefined = await this.postgreSQLDatabase.query(
            "UPDATE application_users SET first_name = $1, last_name = $2 WHERE id = $3",
            [userInformationUpdateInput.getFirstName(), userInformationUpdateInput.getLastName(), userInformationUpdateInput.getUpdatedUserId()]
        );

        const userInformationUpdateOutput = new UserInformationUpdateOutput();

        if (queryResult !== undefined && queryResult.rowCount !== null && queryResult.rowCount > 0) {
            userInformationUpdateOutput.setWetherTheUserInformationWereUpdated(true);
        } else {
            userInformationUpdateOutput.setWetherTheUserInformationWereUpdated(false);
        }

        return userInformationUpdateOutput;
    }

    public async getUserRole(userId: string): Promise<string|false>
    {
        return await this.postgreSQLDatabase.getUserRole(userId);
    }
}