export class DashboardApi {
  private baseUrl = "http://localhost:8081";

  public async fetchPendingData(): Promise<DashboardDTO | undefined> {
    try {
      const response = await httpGet<DashboardDTO>(`${this.baseUrl}/dashboard/transaction/pending-activities`, false);
      console.log('fetchPendingData: ', response);
      return response;
    } catch (error) {
      console.error('Error fetching pending data: ', error);
      throw error;
    }
  }

  public async fetchDashboardData(): Promise<DashboardDTO | undefined> {
    try {
      const response = await httpGet<DashboardDTO>(`${this.baseUrl}/dashboard/fetch-transaction-details`, false);
      console.log('fetchDashboardData: ', response);
      return response;
    } catch (error) {
      console.error('Error fetching dashboard data: ', error);
      throw error;
    }
  }

  public async fetchTransactionData(trid: any): Promise<TransactionDTO | undefined> {
    try {
      const response = await httpGet<TransactionDTO>(`${this.baseUrl}/dashboard/transaction/${trid}`, false);
      console.log('fetchTransactionData: ', response);
      return response;
    } catch (error) {
      console.error(`Error fetching transaction data for TRID ${trid}: `, error);
      throw error;
    }
  }
}
