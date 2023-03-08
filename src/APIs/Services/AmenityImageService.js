import { HttpClient } from "../HttpClient/httpClient";

class amenityImageService extends HttpClient{
constructor() {
    super(`https://localhost:44317/api`);
}



async getAll(){
    return await this.get(`AmenityImages/all`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async getById(id){
    return  await this.get(`AmenityImages/${id}`,{
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }} )
}

async edit(id, body){
    return await this.put(`AmenityImages` , id,body,
    {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async create(body){
    return await this.post('AmenityImages' , body, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }} )
}
async deleteAmenityImage(id){
    return await this.delete("AmenityImages",id, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }});
}

}


export const AmenityImageService = new amenityImageService();