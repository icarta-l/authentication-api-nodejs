import PostgreSQLDatabase from "../../../../../services/database/PostgreSQLDatabase";
import type { QueryResult } from "pg";
import argon2 from "argon2";

import UpdateUserPasswordGateway from "../../UpdateUserPasswordUseCase/UpdateUserPasswordGateway";
import UserPasswordUpdateOutput from "../../UpdateUserPasswordUseCase/UserPasswordUpdateOutput";
import UserPasswordUpdateInput from "../../UpdateUserPasswordUseCase/UserPasswordUpdateInput";

export default class UserPasswordUpdateOnPostgreSQLDatabase implements UpdateUserPasswordGateway
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

    public async updateUserPassword(userPasswordUpdateInput: UserPasswordUpdateInput): Promise<UserPasswordUpdateOutput>
    {
        const hashedPassword: string = await argon2.hash(userPasswordUpdateInput.getChangedPasswordConfirmation());

        const queryResult: QueryResult|undefined = await this.postgreSQLDatabase.query(
            "UPDATE application_users SET password = $1 WHERE id = $2",
            [hashedPassword, userPasswordUpdateInput.getUpdatedUserId()]
        );

        const userPasswordUpdateOutput = new UserPasswordUpdateOutput();

        if (queryResult !== undefined && queryResult.rowCount !== null && queryResult.rowCount > 0) {
            userPasswordUpdateOutput.setWetherTheUserPasswordWasUpdated(true);
        } else {
            userPasswordUpdateOutput.setWetherTheUserPasswordWasUpdated(false);
        }

        return userPasswordUpdateOutput;
    }

    public async originalPasswordMatches(userId: string, originalPassword: string): Promise<boolean>
    {
        const queryResult: QueryResult|undefined = await this.postgreSQLDatabase.query(
            "SELECT password FROM application_users WHERE id = $1",
            [userId]
        );

        if (queryResult !== undefined && queryResult.rowCount !== null && queryResult.rowCount > 0) {
            let originalPasswordIsMatching;

            try {
                originalPasswordIsMatching = await argon2.verify(queryResult.rows[0].password, originalPassword);
            } catch (error) {
                return false;
            }

            return originalPasswordIsMatching;       
        } else {
            return false;
        }
    }
    
    public async getUserRole(userId: string): Promise<string|false>
    {
        return await this.postgreSQLDatabase.getUserRole(userId);
    }
}