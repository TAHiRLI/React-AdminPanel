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
    async put(endpoint, id, body, config){
        return await axios.put(`${this.baseUrl}/${endpoint}/${id}`,body, config);
    }
    async delete(endpoint, id,config){
        return await axios.delete(`${this.baseUrl}/${endpoint}/${id}`, config)
    }
    async downloadExcelFile(endpoint, config){
        axios.get(`${this.baseUrl}/${endpoint}`, config)
          .then(response => {
            // Create a blob URL for the response data
            const url = window.URL.createObjectURL(new Blob([response.data]));
            console.log(response)
            const disposition = response.headers['content-disposition'];
            let filename = 'Doctors.xlsx';
            if (disposition) {
              filename = disposition.split('filename=')[1];
            }
            // Create a link element and click it to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
          })
          .catch(error => {
            console.error(error);
          });
      }
}