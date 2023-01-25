import axios from "axios";

export class HttpClient{
    baseUrl;

    constructor(url){
        this.baseUrl = url;
    }

    async get(endpoint,config){
        return await axios.get(`${this.baseUrl}/${endpoint}`,config);
    }
    async post(endpoint, body,config){
        return await axios.post(`${this.baseUrl}/${endpoint}`, body,config);
    }
    async put(endpoint, id, body){
        return await axios.put(`${this.baseUrl}/${endpoint}/${id}`, body);
    }
    async delete(endpoint, id){
        return await axios.delete(`${this.baseUrl}/${endpoint}/${id}`)
    }
}