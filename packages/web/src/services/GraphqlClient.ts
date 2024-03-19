import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { createPaymentRequestVars } from './dummyData';

export class GraphqlClient {
    private client: ApolloClient<any>;
    constructor(token: string) {
        const cache = new InMemoryCache();
        this.client = new ApolloClient({
            cache: cache,
            uri: 'https://api.stitch.money/graphql',
            name: 'stitch-web-client',
            version: '1.3',
            queryDeduplication: false,
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: 'cache-and-network',
                },
            },
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }

    async createPaymentRequest(): Promise<any> {
        const variables = createPaymentRequestVars
        const response = await this.client.mutate({
            mutation: gql`
            mutation CreatePaymentRequest(
                $amount: MoneyInput!,
                $payerReference: String!,
                $beneficiaryReference: String!,
                $externalReference: String,
                $beneficiaryName: String!,
                $beneficiaryBankId: BankBeneficiaryBankId!,
                $beneficiaryAccountNumber: String!,
                $merchant: String
                ) {
              clientPaymentInitiationRequestCreate(input: {
                  amount: $amount,
                  payerReference: $payerReference,
                  beneficiaryReference: $beneficiaryReference,
                  externalReference: $externalReference,
                  beneficiary: {
                      bankAccount: {
                          name: $beneficiaryName,
                          bankId: $beneficiaryBankId,
                          accountNumber: $beneficiaryAccountNumber
                      }
                  },
                  merchant: $merchant
                }) {
                paymentInitiationRequest {
                  id
                  url
                }
              }
            }
            `,
            variables
        })
        return response.data
    }


}