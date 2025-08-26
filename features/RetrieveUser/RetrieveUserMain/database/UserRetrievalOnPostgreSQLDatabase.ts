import PostgreSQLDatabase from "../../../../services/database/PostgreSQLDatabase";
import type { QueryResult } from "pg";
import UserRetrievalOutput from "../../RetrieveUserUseCase/UserRetrievalOutput";
import RetrieveUserGateway from "../../RetrieveUserUseCase/RetrieveUserGateway";

export default class UserRetrievalOnPostgreSQLDatabase implements RetrieveUserGateway
{
    private postgreSQLDatabase: PostgreSQLDatabase;

    constructor() {
        this.postgreSQLDatabase = PostgreSQLDatabase.getInstance();
    }

    public async connect(): Promise<void> 
    {
        this.postgreSQLDatabase.connect();
    }

    public async close(): Promise<void> 
    {
        this.postgreSQLDatabase.close();
    }

    public async query(query: string, values?: Array<any>): Promise<any>
    {
        return await this.postgreSQLDatabase.query(query, values);
    }

    public async retrieveUser(userId: string): Promise<UserRetrievalOutput|false>
    {
        const queryResult: QueryResult|undefined = await this.postgreSQLDatabase.query(
            "SELECT id, username, email, first_name, last_name FROM application_users WHERE id = $1",
            [userId]
        );

        if (queryResult !== undefined && queryResult.rowCount !== null && queryResult.rowCount > 0) {
            const userRetrievalOutput = new UserRetrievalOutput();
            userRetrievalOutput.setUsername(queryResult.rows[0].username)
            .setEmail(queryResult.rows[0].email)
            .setFirstName(queryResult.rows[0].first_name)
            .setLastName(queryResult.rows[0].last_name)
            .setUserId(queryResult.rows[0].id);

            return userRetrievalOutput;
        } else {
            return false;
        }
    }
}