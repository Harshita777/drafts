export class DashboardApi {
  private baseUrl = "http://localhost:8081";

  public async fetchPendingData(): Promise<DashboardDTO> {
    return await httpGet<DashboardDTO>(`${this.baseUrl}/dashboard/transaction/pending-activities`, false);
  }
  public async fetchDashboardData(): Promise<DashboardDTO> {
    return await httpGet<DashboardDTO>(`${this.baseUrl}/dashboard/fetch-transaction-details`, false);
  }
  public async fetchTransactionData(trid: any): Promise<TransactionDTO> {
    return await httpGet<TransactionDTO>(`${this.baseUrl}/dashboard/transaction/${trid}`, false);
  }
}




export class AddBeneficiaryApi {
  public async getBeneficiary(
    iBanNumber: string
  ): Promise<BeneficiaryDto | undefined> {
    const data = {
      iBanNumber
    };
    try {
      const response = await httpGet<BeneficiaryDto>(getBeneficiaryByIBAN + `/${iBanNumber}`, false);
      console.log('login: ', response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  public async addBeneficiary(payload: AddBeneficiary): Promise<AddBeneficiaryModelDto | undefined> {
    try {
      const response = await httpPost<AddBeneficiaryModelDto>(addBeneficiaryUrl, true, payload, true);
      console.log('addBeneficiary: ', response, payload);

      return response;
    } catch (error) {
      throw error;
    }
  }

}
