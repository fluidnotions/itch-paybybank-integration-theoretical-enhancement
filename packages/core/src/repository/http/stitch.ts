import axios from "axios";

export type TokenResponse = {
    access_token: string
    expires_in: number
    token_type: string
    scope: string
}

export class Stitch {

    //FIXME: very inflexible method, would be better to generalize and have this call the general with a more specific name
    static async getSecureToken(id: string, secret: string): Promise<TokenResponse> {
        const response = await axios.post('https://secure.stitch.money/connect/token', {
            grant_type: 'client_credentials',
            audience: 'https://secure.stitch.money/connect/token',
            scope: 'client_paymentrequest',
            client_id: id,
            client_secret: secret,
        }, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
        return response.data;
    }
}
