import  {HttpClient } from "../HttpClient/httpClient";

class loginService extends HttpClient{
constructor() {
    super("https://localhost:44317/api/Accounts");
}

async SubmitLogin(body){
   return await this.post('login', body)
}
async CheckAuth(token){
    return await this.get('isAuthenticated', {
        headers:{
            authorization: `Bearer ${token}`
        }
    })
}
async getRoles(){
    return await this.get('getRoles', {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async getAllRoles(){
    return await this.get('Roles/All', {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}
}

export const LoginService = new loginService();