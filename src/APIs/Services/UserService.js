import { HttpClient } from "../HttpClient/httpClient";

class userService extends HttpClient {
    constructor() {
        super(`https://localhost:44317/api`);
    }



    async getAll() {
        return await this.get(`Users/all`, {
            headers: {
                authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
            }
        });
    }

    async createAdmin(body) {
        return await this.post('Users/Admin', body, {
            headers: {
                authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
            }
        });
    }

    async edit(id, body) {
        return await this.put(`Users/Admin`, id, body,
            {
                headers: {
                    authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
                }
            });
    }
   
    async getAllAdmins() {
        return await this.get(`Users/Admins/all`, {
            headers: {
                authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
            }
        });
    }
    async getById(id) {
        return await this.get(`Users/${id}`, {
            headers: {
                authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
            }
        });
    }

    // Examinations 
    async editExamination(id, body) {
        return await this.put(`MedicalExaminations`, id, body,
            {
                headers: {
                    authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
                }
            });
    }
    async getExaminations(userId) {
        return await this.get(`MedicalExaminations/All/${userId}`, {
            headers: {
                authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
            }
        });
    }
    async getExaminationById(id) {
        return await this.get(`MedicalExaminations/${id}`, {
            headers: {
                authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
            }
        });
    }
    async rejectExamination(id) {
        return await this.get(`MedicalExaminations/Reject/${id}`, {
            headers: {
                authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
            }
        });
    }

    
    async createExamination(body) {
        return await this.post('MedicalExaminations', body, {
            headers: {
                authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
            }
        });
    }
    
    // test to downoad from child class

    async downloadFile(id) {
        const url = `MedicalExaminations/Download/${id}`;
        const config = {
            responseType: 'blob',
            headers: {
                authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
            }
        };
        const fileData = await this.get(url, config);
        const filename = decodeURIComponent(url.split('/').pop());
        const blob = new Blob([fileData.data], { type: fileData.headers['content-type'] });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    }



}


export const UserService = new userService();