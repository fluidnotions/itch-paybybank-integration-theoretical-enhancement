import axios, { AxiosInstance } from "axios";

class HttpClientStatic {
    private http: AxiosInstance
    constructor() {
        this.http = axios.create({
            baseURL: import.meta.env.VITE_APP_API_URL || 'https://fnsh1q5wuc.execute-api.us-east-1.amazonaws.com',
            timeout: 10000,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    public async getStitchToken(): Promise<string> {
        const response = await this.http.get('/token-proxy');
        console.log('HttpClient: getStitchToken: response', response.data)
        return response.data.access_token
    }

    public async createPayer(payerId: string): Promise<any> {
        //could have a sperate lambda for this, but why waste, they are too similair. Unprovisioned as it is, at least this one will stay warm
        const response = await this.http.put('/enrol-payer-selfie', { payerId })
        console.log('HttpClient: createPayer: response', response.data)
        return response.data
    }

    public async enrolSelfie(payerId: string, selfie: string): Promise<any> {
        const response = await this.http.put('/enrol-payer-selfie', { payerId, selfie })
        console.log('HttpClient: enrolSelfie: response', response.data)
        return response.data
    }

    public async verifySelfie(payerId: string, selfie: string): Promise<any> {
        try {
            const response = await this.http.post('/verify-payer-selfie', { payerId, selfie })
            console.log('HttpClient: verifySelfie: response', response.data)
            return response.data
        } catch (error: any) {
            if (error.response.data == 'Request has invalid parameters') {
                console.log('HttpClient: verifySelfie: error (likely no face found in image)')
            }
            return { error: error.response.data }
        }

    }
}
export const HttpClient = new HttpClientStatic()