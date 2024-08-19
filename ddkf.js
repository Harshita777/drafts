
export const debitDetailsReducer = (state = initialState, action: any): DebitAccountRows => {
    switch (action.type) {
        case DEBIT_DETAILS_ACTION :
            return { ...state, loading: true, error: null };
        case DEBIT_DETAILS_RESPONSE_ACTION:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: action.error || null,
            };
        default:
            return state;
    }
};



function* debitDetailSaga({ payload }: any) {
    try {
        const response: DebitAccountRows = yield uploadApi.retrieveDebitDetails(payload);
        const successAction = {
            type: DEBIT_DETAILS_RESPONSE_ACTION,
            payload: {
                data: response,
                error: ''
            }
        };
        yield put(successAction);
    } catch (error: any) {
        const failureAction = {
            type: DEBIT_DETAILS_RESPONSE_ACTION,
            payload: {
                data: null,
                error: error.message
            }
        };
        yield put(failureAction);
    }
}




public async retrieveDebitDetails(payload:any): Promise<DebitAccountRows | undefined> {
        try {
            // http://localhost:8081/accounts/get-all-accounts
            const response = await httpPost<DebitAccountRows>(`http://localhost:8081/accounts/get-all-accounts`, payload,false);
            return response;
        } catch (error) {
            throw error;
        }
    }



useEffect(()=>{
        dispatch({
            type: DEBIT_DETAILS_ACTION})
    },[])



export const DEBIT_DETAILS_ACTION = "DEBIT_DETAILS_ACTION"
export const DEBIT_DETAILS_RESPONSE_ACTION = "DEBIT_DETAILS_RESPONSE_ACTION"
