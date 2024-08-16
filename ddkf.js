interface DebitAccount {
    accountName: string;
    accountType: string;
    balance: string;
    currencyCode: string;
}

interface Beneficiary {
    beneficiaryName: string;
    beneficiaryNickName: string;
    beneficiaryBankName: string;
    beneficiaryIBAN: string;
}

interface DealReference {
    dealReferenceCode: string;
    dealCode: string;
}

interface PaymentDetails {
    paymentAmount: string;
    debitedAmount: string;
    chargeType: string;
    paymentDate: string;
    valueDate: string;
}

interface IntermediaryBank {
    bankName: string;
    bankDetails: string;
}

interface SenderCorrespondentDetails {
    intermediaryBank: IntermediaryBank;
}

interface AdditionalDetails {
    invoiceDate: string;
    contractNo: string;
}

interface TransactionState {
    debitAccountId: DebitAccount;
    beneficiaryId: Beneficiary;
    dealReference: DealReference;
    paymentDetails: PaymentDetails;
    senderCorrespondentDetails: SenderCorrespondentDetails;
    additionalDetails: AdditionalDetails;
}

export default TransactionState;




import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Grid, Stack, Text, Div, Flex, Divider } from '@enbdleap/react-ui';
import { AE, Bank, Bills, InfoIcon } from '@enbdleap/react-icons';
import { FETCH_TRANSACTION_REQUEST } from '../../Redux/Actions/DashboardActions';
import TransactionState from './TransactionState';

const PaymentDetails: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const trid = searchParams.get('trid');
    const transactionState: TransactionState = useSelector((state: any) => state.transactionReducer);

    useEffect(() => {
        dispatch({ type: FETCH_TRANSACTION_REQUEST, data: trid });
    }, [dispatch, trid]);

    const handleClose = () => {
        navigate("/");
    };

    console.log("trid", trid);

    const { debitAccountId, beneficiaryId, dealReference, paymentDetails, senderCorrespondentDetails, additionalDetails } = transactionState || {};

    return (
        <Grid container className='bg-blue-50' spacing={2} sx={{ p: 3 }}>
            {/* JSX Code remains unchanged */}
        </Grid>
    );
};

export default PaymentDetails;
