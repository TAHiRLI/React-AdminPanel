import { HttpClient } from "../HttpClient/httpClient";

class loginService extends HttpClient{
constructor() {
    super("https://localhost:7057/admin/api/Accounts");
}

async SubmitLogin(body,config){
   return await this.post('login', body,config)
}
async CheckAuth(token){
    return await this.get('isAuthenticated', {
        headers:{
            authorization: `Bearer ${token}`
        }
    })
}
}

export const LoginService = new loginService();