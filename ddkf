  {
 
    "from" : [
        {
            "accountname":"new account",
            "accountnumber":"0000098766",
            "balance": "130,600,00.00 AED"
            "branch":"embd"
        }
    ]
 
    "to" : [
        {
            "accountname":"new account",
            "accountnumber":"0000098766",
            "balance": "130,600,00.00 AED"
            "branch":"embd"
        }
    ]
 
    "deal-referance" : [
        {
            "reference code":"234.37 USD",
            "deal code":"300.00 AED",
        }
    ]
 
    "payment" : [
        {
            "payment benifercy":"1000.00 AED",
            "Debit account":"2",
            "changetype": "",
            "payment-date" "Today , 10 july 2024",
            "value-date" "Today , 10 july 2024",
        }
    ]
 
    "sender-details" : [
        {
            "bankname":"hdfc",
            "bankdetail":"UAE",
        }
    ]
 
     "intermidiate-bank-details" : [
        {
            "bankname":"hdfc",
            "bankdetail":"UAE",
        }
    ]
 
     "additional-details" : [
        {
            "purpose":"agency communicatiomn",
            "paymentdetail":"UAE",
            "customerreference":"",
            "autheriour":""
        }
    ] 

 
 
}









const initialState = {
  from: [],
  to: [],
  dealReference: [],
  payment: [],
  senderDetails: [],
  intermediateBankDetails: [],
  additionalDetails: [],
  loading: false,
  error: null,
};

const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRANSACTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        from: action.payload.from || [],
        to: action.payload.to || [],
        dealReference: action.payload["deal-referance"] || [],
        payment: action.payload.payment || [],
        senderDetails: action.payload["sender-details"] || [],
        intermediateBankDetails: action.payload["intermidiate-bank-details"] || [],
        additionalDetails: action.payload["additional-details"] || [],
      };
    case FETCH_TRANSACTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export { transactionReducer };







import { call, put, takeLatest } from 'redux-saga/effects';
import { TransactionApi } from '../../Services/TransactionServices';
import {
  FETCH_TRANSACTION_REQUEST,
  FETCH_TRANSACTION_SUCCESS,
  FETCH_TRANSACTION_FAILURE,
} from '../Actions/TransactionActions';

// Create an instance of TransactionApi
const transactionApi = new TransactionApi();

// Worker Saga
function* fetchTransaction(): Generator<any, void, any> {
  try {
    const response = yield call(() => transactionApi.fetchTransactionData());
    const data = response.data;

    console.log('Transaction Data:', data); 
    yield put({ type: FETCH_TRANSACTION_SUCCESS, payload: data });
  } catch (error: any) {
    yield put({ type: FETCH_TRANSACTION_FAILURE, payload: error.message });
  }
}

// Watcher Saga
function* watchFetchTransaction() {
  yield takeLatest(FETCH_TRANSACTION_REQUEST, fetchTransaction);
}

export default watchFetchTransaction;








// From DTO
export interface FromDTO {
  accountname: string;
  accountnumber: string;
  balance: string;
  branch: string;
}

// To DTO
export interface ToDTO {
  accountname: string;
  accountnumber: string;
  balance: string;
  branch: string;
}

// Deal Reference DTO
export interface DealReferenceDTO {
  referenceCode: string;
  dealCode: string;
}

// Payment DTO
export interface PaymentDTO {
  paymentBeneficiary: string;
  debitAccount: string;
  chargeType: string;
  paymentDate: string;
  valueDate: string;
}

// Sender Correspondent Details DTO
export interface SenderDetailsDTO {
  bankName: string;
  bankDetail: string;
}

// Intermediate Bank Details DTO
export interface IntermediateBankDetailsDTO {
  bankName: string;
  bankDetail: string;
}

// Additional Details DTO
export interface AdditionalDetailsDTO {
  purpose: string;
  paymentDetail: string;
  customerReference: string;
  authorizer: string;
}



export interface TransactionDTO {
  from: FromDTO[];
  to: ToDTO[];
  dealReference: DealReferenceDTO[];
  payment: PaymentDTO[];
  senderDetails: SenderDetailsDTO[];
  intermediateBankDetails: IntermediateBankDetailsDTO[];
  additionalDetails: AdditionalDetailsDTO[];
}




// TransactionApi.ts
import { httpGet } from "./httpServices";
import { TransactionDTO } from "./TransactionDTO";

export class TransactionApi {
    private baseUrl = "http://localhost:5000";

    public async fetchTransactionData(): Promise<TransactionDTO> {
        return await httpGet<TransactionDTO>(`${this.baseUrl}/transaction`, false);
    }
}
