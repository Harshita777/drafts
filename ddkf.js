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






import React from 'react';

const App = () => {
  const data = {
    from: [
      {
        accountname: "new account",
        accountnumber: "0000098766",
        balance: "130,600,00.00 AED",
        branch: "embd"
      }
    ],
    to: [
      {
        accountname: "new account",
        accountnumber: "0000098766",
        balance: "130,600,00.00 AED",
        branch: "embd"
      }
    ],
    "deal-referance": [
      {
        "reference code": "234.37 USD",
        "deal code": "300.00 AED"
      }
    ],
    payment: [
      {
        "payment benifercy": "1000.00 AED",
        "Debit account": "2",
        changetype: "",
        "payment-date": "Today , 10 july 2024",
        "value-date": "Today , 10 july 2024"
      }
    ],
    "sender-details": [
      {
        bankname: "hdfc",
        bankdetail: "UAE"
      }
    ],
    "intermidiate-bank-details": [
      {
        bankname: "hdfc",
        bankdetail: "UAE"
      }
    ],
    "additional-details": [
      {
        purpose: "agency communicatiomn",
        paymentdetail: "UAE",
        customerreference: "",
        autheriour: ""
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Sender & Beneficiary Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Select Sender & Beneficiary from the list below</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">From</h3>
            <p>{data.from[0].accountname}</p>
            <p>Current Account: {data.from[0].accountnumber}</p>
            <p>Available Balance: <strong>{data.from[0].balance}</strong></p>
            <p>{data.from[0].branch}</p>
            <a href="#" className="text-blue-500">Change</a>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">To</h3>
            <p>{data.to[0].accountname}</p>
            <p>Current Account: {data.to[0].accountnumber}</p>
            <p>Available Balance: <strong>{data.to[0].balance}</strong></p>
            <p>{data.to[0].branch}</p>
            <a href="#" className="text-blue-500">Change</a>
          </div>
        </div>
      </div>

      {/* Deal Reference Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Deal Reference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>Deal Reference Code</p>
            <p className="text-gray-700">{data["deal-referance"][0]["reference code"]}</p>
          </div>
          <div>
            <p>Deal Code</p>
            <p className="text-gray-700">{data["deal-referance"][0]["deal code"]}</p>
          </div>
        </div>
      </div>

      {/* Payment Details Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>Payment to Beneficiary</p>
            <p className="text-gray-700">{data.payment[0]["payment benifercy"]}</p>
          </div>
          <div>
            <p>Debit Account</p>
            <p className="text-gray-700">{data.payment[0]["Debit account"]}</p>
          </div>
          <div>
            <p>Charge Type</p>
            <p className="text-gray-700">{data.payment[0].changetype || "N/A"}</p>
          </div>
          <div>
            <p>Payment Date</p>
            <p className="text-gray-700">{data.payment[0]["payment-date"]}</p>
          </div>
          <div>
            <p>Value Date</p>
            <p className="text-gray-700">{data.payment[0]["value-date"]}</p>
          </div>
        </div>
      </div>

      {/* Sender Correspondent Details Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Sender Correspondent Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>Bank Name</p>
            <p className="text-gray-700">{data["sender-details"][0].bankname}</p>
          </div>
          <div>
            <p>Bank Details</p>
            <p className="text-gray-700">{data["sender-details"][0].bankdetail}</p>
          </div>
        </div>
      </div>

      {/* Intermediate Bank Details Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Intermediate Bank Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>Bank Name</p>
            <p className="text-gray-700">{data["intermidiate-bank-details"][0].bankname}</p>
          </div>
          <div>
            <p>Bank Details</p>
            <p className="text-gray-700">{data["intermidiate-bank-details"][0].bankdetail}</p>
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>Purpose</p>
            <p className="text-gray-700">{data["additional-details"][0].purpose}</p>
          </div>
          <div>
            <p>Payment Detail</p>
            <p className="text-gray-700">{data["additional-details"][0].paymentdetail}</p>
          </div>
          <div>
            <p>Customer Reference</p>
            <p className="text-gray-700">{data["additional-details"][0].customerreference || "N/A"}</p>
          </div>
          <div>
            <p>Authorizer</p>
            <p className="text-gray-700">{data["additional-details"][0].autheriour || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;








import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_DASHBOARD_REQUEST, FETCH_TRANSACTION_REQUEST } from '../../Redux/Actions/DashboardActions';

// Define the types for the structure of the data
interface AccountDetails {
  accountname: string;
  accountnumber: string;
  balance: string;
  branch: string;
}

interface DealReference {
  "reference code": string;
  "deal code": string;
}

interface PaymentDetails {
  "payment benifercy": string;
  "Debit account": string;
  changetype: string;
  "payment-date": string;
  "value-date": string;
}

interface BankDetails {
  bankname: string;
  bankdetail: string;
}

interface AdditionalDetails {
  purpose: string;
  paymentdetail: string;
  customerreference: string;
  autheriour: string;
}

interface TransactionState {
  from?: AccountDetails[];
  to?: AccountDetails[];
  deal_referance?: DealReference[];
  payment?: PaymentDetails[];
  sender_details?: BankDetails[];
  intermidiate_bank_details?: BankDetails[];
  additional_details?: AdditionalDetails[];
}

// Card component with explicit typing for children
const Card = ({ children }: { children: ReactNode }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-4">{children}</div>
);

const PaymentDetails: React.FC = () => {
    const dispatch = useDispatch();
  // Type the state from useSelector
  const transactionState = useSelector((state: any) => state.transactionReducer) as TransactionState;
  useEffect(() => {
    dispatch({ type: FETCH_DASHBOARD_REQUEST });
    dispatch({ type: FETCH_TRANSACTION_REQUEST });
  }, [dispatch]);
  const { 
    from = [], 
    to = [], 
    deal_referance = [], 
    payment = [], 
    sender_details = [], 
    intermidiate_bank_details = [], 
    additional_details = [] 
  } = transactionState || {};

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="flex justify-between mb-4">
          {from.map((sender, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold">From</h3>
              <p>{sender.accountname}</p>
              <p>Account Number: {sender.accountnumber}</p>
              <p>Balance: {sender.balance}</p>
              <p>Branch: {sender.branch}</p>
            </div>
          ))}
          {to.map((recipient, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold">To</h3>
              <p>{recipient.accountname}</p>
              <p>Account Number: {recipient.accountnumber}</p>
              <p>Balance: {recipient.balance}</p>
              <p>Branch: {recipient.branch}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Deal Reference</h3>
        <div className="grid grid-cols-2 gap-4">
          {deal_referance.map((deal, index) => (
            <div key={index}>
              <p>Deal Reference Code: {deal["reference code"]}</p>
              <p>Deal Code: {deal["deal code"]}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
        <div className="grid grid-cols-2 gap-4">
          {payment.map((pay, index) => (
            <div key={index}>
              <p>Payment to Beneficiary: {pay["payment benifercy"]}</p>
              <p>Debit Account: {pay["Debit account"]}</p>
              <p>Payment Date: {pay["payment-date"]}</p>
              <p>Value Date: {pay["value-date"]}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Bank Details</h3>
        <div className="grid grid-cols-2 gap-4">
          {sender_details.map((senderDetail, index) => (
            <div key={index}>
              <h4 className="font-semibold">Sender Details</h4>
              <p>Bank Name: {senderDetail.bankname}</p>
              <p>Bank Detail: {senderDetail.bankdetail}</p>
            </div>
          ))}
          {intermidiate_bank_details.map((intermediateDetail, index) => (
            <div key={index}>
              <h4 className="font-semibold">Intermediate Bank Details</h4>
              <p>Bank Name: {intermediateDetail.bankname}</p>
              <p>Bank Detail: {intermediateDetail.bankdetail}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Additional Details</h3>
        {additional_details.map((detail, index) => (
          <div key={index}>
            <p>Purpose: {detail.purpose}</p>
            <p>Payment Detail: {detail.paymentdetail}</p>
            <p>Customer Reference: {detail.customerreference}</p>
            <p>Authorizer: {detail.autheriour}</p>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default PaymentDetails;






const transactionReducer = (state = initialStateTrans, action: any) => {
  switch (action.type) {
    case FETCH_TRANSACTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_TRANSACTION_SUCCESS:
      console.log('Action Payload:', action.payload);
      return {
        ...state,
        loading: false,
        ...action.payload, // Spread the response payload directly into the state
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

