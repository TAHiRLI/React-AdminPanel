import { HttpClient } from "../HttpClient/httpClient";

class blogCategoryService extends HttpClient{
constructor() {
    super(`https://localhost:44317/api`);
}



async getAll(){
    return await this.get(`BlogCategories/all`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async getById(id){
    return  await this.get(`BlogCategories/${id}`,{
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }} )
}

async edit(id, body){
    return await this.put(`BlogCategories` , id,body,
    {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async create(body){
    return await this.post('BlogCategories' , body, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }} )
}
async deleteCategory (id){
    return await this.delete("BlogCategories",id, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }});
}

}


export const BlogCategoryService = new blogCategoryService();