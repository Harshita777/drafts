public async fetchTransactionSummary(payload: any): Promise<TransactionsResponseDTO | undefined> {
    const data =  payload;
    try {
      const response = await httpPost<TransactionsResponseDTO>(`${transactionSummary}`, data,false,);

      return response;
    } catch (error) {
      console.error(`Error fetching transaction data for: `, error);
      throw error;
    }
  }


function* fetchTransactionSummary(payload:any): Generator<any, void, any> {
    try {
        const response = yield call(() => dashboardApi.fetchTransactionSummary(payload));
        const data = response;


        yield put({ type: FETCH_TRANSACTION_SUMMARY_SUCCESS, payload: data });
    } catch (error: any) {
        yield put({ type: FETCH_TRANSACTION_SUMMARY_FAILURE, payload: error.message });
    }
}




const transactionSummaryReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_TRANSACTION_SUMMARY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_TRANSACTION_SUMMARY_SUCCESS:

      return {
        ...state,
        loading: false,
        ...action.payload, 
      };

    case FETCH_TRANSACTION_SUMMARY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};




useEffect(() => {
  dispatch({ type: FETCH_TRANSACTION_SUMMARY_REQUEST,payload:{
    userId:"user001"
  } });




export const FETCH_TRANSACTION_SUMMARY_REQUEST = 'FETCH_TRANSACTION_SUMMARY_REQUEST';
export const FETCH_TRANSACTION_SUMMARY_SUCCESS = 'FETCH_TRANSACTION_SUMMARY_SUCCESS';
export const FETCH_TRANSACTION_SUMMARY_FAILURE = 'FETCH_TRANSACTION_SUMMARY_FAILURE';
