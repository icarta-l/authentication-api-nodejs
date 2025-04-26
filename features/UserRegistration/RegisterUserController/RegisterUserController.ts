import Request from "../../../services/controller/Request";
import Response from "../../../services/controller/Response";

export class RegisterUserController
{
    public handleRequest(request: Request): Response
    {
        if (request.getParameters().action !== "register_user") {
            throw new Error();
        }
        
        return new Response();
    }
}