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

const PaymentDetails: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const trid = searchParams.get('trid');
    const transactionState = useSelector((state: any) => state.transactionReducer);

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
            <Grid item xs={12}>
                <Card className='border-radius-16 p-6 shadow-none' elevation={1}>
                    <Grid item xs={12} mb={2}>
                        <Text variant='h5'>Select Sender & Beneficiary from the list below</Text>
                    </Grid>
                    <Box className="flex p-2 justify-between gap-4">
                        <Box className='w-2/4 p-3 rounded-md border-dashed'>
                            <Flex direction="column">
                                <Text variant="h6" className="font-medium">From</Text>
                                <Stack direction="row" alignItems="center" mb={1}>
                                    <Div className="transaction-icons">
                                        <AE size={16} />
                                    </Div>
                                    <Text className="text-with-icon" variant='h5'>{debitAccountId?.accountName || 'Account Name'}</Text>
                                </Stack>
                                <Text mb={1} variant='label1'>{debitAccountId?.accountType || 'Account Type'}</Text>
                                <Stack direction="row" alignItems="center" mb={1}>
                                    <Text variant='label1'>Available Balance</Text>
                                    <Text variant='button1' ml={0.5}>{debitAccountId?.balance || 'Balance'}</Text>
                                    <Text variant='label1' color='secondary' ml={0.5}>(as of 8 July, 2024, 08:00PM)</Text>
                                </Stack>
                                <Stack direction="row" alignItems="center" mb={1}>
                                    <Div className="transaction-icons">
                                        <Bank size={16} />
                                    </Div>
                                    <Text className="text-with-icon" variant='button1'>{debitAccountId?.currencyCode || 'Currency'}</Text>
                                </Stack>
                            </Flex>
                        </Box>
                        <Box className='w-2/4 p-3 rounded-md border-dashed'>
                            <Flex direction="column">
                                <Text variant='h5' mb={2}>To</Text>
                                <Stack direction="row" alignItems="center" mb={1}>
                                    <Div className="transaction-icons">
                                        <AE size={16} />
                                    </Div>
                                    <Text className="text-with-icon" variant='h5'>{beneficiaryId?.beneficiaryName || 'Beneficiary Name'}</Text>
                                </Stack>
                                <Text mb={1} variant='label1'>{beneficiaryId?.beneficiaryNickName || 'Nick Name'}</Text>
                                <Stack direction="row" alignItems="center" mb={1}>
                                    <Div className="transaction-icons">
                                        <Bank size={16} />
                                    </Div>
                                    <Text className="text-with-icon" variant='button1'>{beneficiaryId?.beneficiaryBankName || 'Bank Name'}</Text>
                                </Stack>
                                <Stack direction="row" alignItems="center" mb={1}>
                                    <Div className="transaction-icons">
                                        <Bills size={16} />
                                    </Div>
                                    <Text className="text-with-icon" variant='button1'>{beneficiaryId?.beneficiaryIBAN || 'IBAN'}</Text>
                                </Stack>
                            </Flex>
                        </Box>
                    </Box>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card className='border-radius-16 shadow-none p-6' elevation={1}>
                    <Grid item xs={12} mb={2}>
                        <Text variant='h5'>Deal Reference</Text>
                    </Grid>
                    <Box>
                        <Div>
                            <Box className='bg-blue-50 p-3 rounded-t-lg flex justify-between'>
                                <Text variant='label3' className='font-medium'>Deal Reference Code</Text>
                                <Text variant='label3' className='font-medium'>{dealReference?.dealReferenceCode || 'Deal Reference Code'}</Text>
                            </Box>
                            <Divider className='w-auto' />
                            <Box className='bg-blue-50 p-3 rounded-b-lg flex justify-between'>
                                <Text variant='label3' className='font-medium'>Deal Code</Text>
                                <Text variant='label3' className='font-medium'>{dealReference?.dealCode || 'Deal Code'}</Text>
                            </Box>
                        </Div>
                    </Box>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card className='border-radius-16 shadow-none p-6' elevation={1}>
                    <Grid item xs={12} mb={2}>
                        <Text variant='h5'>Payment Details</Text>
                    </Grid>
                    <Div>
                        <Div>
                            <Box className='bg-blue-50 p-3 rounded-t-lg flex justify-between'>
                                <Text variant='label3' className='font-medium'>Payment to Beneficiary</Text>
                                <Text variant='label3' className='font-medium'>{paymentDetails?.paymentAmount || 'Payment Amount'}</Text>
                            </Box>
                            <Divider className='w-auto' />
                            <Box className='bg-blue-50 p-3 flex justify-between'>
                                <Text variant='label3' className='font-medium'>Debit Account</Text>
                                <Text variant='label3' className='font-medium'>{paymentDetails?.debitedAmount || 'Debited Amount'}</Text>
                            </Box>
                            <Divider className='w-auto' />
                            <Box className='bg-blue-50 p-3 flex justify-between'>
                                <Text variant='label3' className='font-medium'>Charge Type</Text>
                                <Text variant='label3' className='font-medium'>{paymentDetails?.chargeType || 'Charge Type'}</Text>
                            </Box>
                            <Divider className='w-auto' />
                            <Box className='bg-blue-50 p-3 flex justify-between'>
                                <Text variant='label3' className='font-medium'>Payment Date</Text>
                                <Text variant='label3' className='font-medium'>{new Date(paymentDetails?.paymentDate).toLocaleDateString() || 'Payment Date'}</Text>
                            </Box>
                            <Divider className='w-auto' />
                            <Box className='bg-blue-50 p-3 rounded-b-lg flex justify-between'>
                                <Text variant='label3' className='font-medium'>Value Date</Text>
                                <Text variant='label3' className='font-medium'>{new Date(paymentDetails?.valueDate).toLocaleDateString() || 'Value Date'}</Text>
                            </Box>
                        </Div>
                    </Div>
                    <Box className='flex mt-2'>
                        <Div className='text-blue-700'><InfoIcon className='' /></Div>
                        <Text variant='label3' className='text-gray-500 mt-1'>Your payment will be processed on 18 July 2024</Text>
                    </Box>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card className='border-radius-16 p-6 shadow-none' elevation={1}>
                    <Div>
                        <Div>
                            <Grid item xs={12} mb={2}>
                                <Text variant='h5'>Sender Correspondent Details</Text>
                            </Grid>
                            <Box className='bg-blue-50 p-3 rounded-t-lg flex justify-between'>
                                <Text variant='label3' className='font-medium'>Bank Name</Text>
                                <Text variant='label3' className='font-medium'>{senderCorrespondentDetails?.intermediaryBank?.bankName || 'Intermediary Bank'}</Text>
                            </Box>
                            <Divider className='w-auto' />
                            <Box className='bg-blue-50 p-3 rounded-b-lg flex justify-between'>
                                <Text variant='label3' className='font-medium'>Bank Detail</Text>
                                <Text variant='label3' className='font-medium'>{senderCorrespondentDetails?.intermediaryBank?.bankDetails || 'Intermediary Bank Details'}</Text>
                            </Box>
                        </Div>
                    </Div>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card className='border-radius-16 p-6 shadow-none' elevation={1}>
                    <Div>
                        <Grid item xs={12} mb={2}>
                            <Text variant='h5'>Additional Details</Text>
                        </Grid>
                        <Div>
                            <Box className='bg-blue-50 p-3 rounded-t-lg flex justify-between'>
                                <Text variant='label3' className='font-medium'>Invoice Date</Text>
                                <Text variant='label3' className='font-medium'>{new Date(additionalDetails?.invoiceDate).toLocaleDateString() || 'Invoice Date'}</Text>
                            </Box>
                            <Divider className='w-auto' />
                            <Box className='bg-blue-50 p-3 rounded-b-lg flex justify-between'>
                                <Text variant='label3' className='font-medium'>Contract Number</Text>
                                <Text variant='label3' className='font-medium'>{additionalDetails?.contractNo || 'Contract Number'}</Text>
                            </Box>
                        </Div>
                    </Div>
                </Card>
            </Grid>
        </Grid>
    );
};

export default PaymentDetails;
