import { HttpClient } from "../HttpClient/httpClient";

class settingService extends HttpClient{
constructor() {
    super(`https://localhost:44317/api`);
}

async getAll(){
    return await this.get(`Settings/All`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async getById(id){
    return  await this.get(`Settings/${id}`,{
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }} )
}

async edit(id, body){
    return await this.put(`Settings` , id,body,
    {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}
}


export const SettingService = new settingService();