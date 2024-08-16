import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_DASHBOARD_REQUEST, FETCH_TRANSACTION_REQUEST } from '../../redux/actions/DashboardActions';
import { Box, Card, Grid, Stack, Text, Div, Flex, Divider, Button } from '@enbdleap/react-ui';
import { AE, Bank } from '@enbdleap/react-icons'
import { Bills } from '@enbdleap/react-icons'
import { useNavigate } from 'react-router-dom'
import { InfoIcon } from '@enbdleap/react-icons'
interface AccountDetails {
    accountname: string;
    accountnumber: string;
    balance: string;
    branch: string;
}

interface DealReferance {
    referenceCode: string;
    dealCode: string;
}

interface PaymentDetails {
    paymentBenifercy: string;
    DebitAccount: string;
    changetype: string;
    paymentDate: string;
    valueDate: string;
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
    dealReferance?: DealReferance[];
    payment?: PaymentDetails[];
    senderDetails?: BankDetails[];
    intermidiateBankDetails?: BankDetails[];
    additionalDetails?: AdditionalDetails[];
}



const PaymentDetails: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    
    const transactionState = useSelector((state: any) => state.transactionReducer) as TransactionState;
    useEffect(() => {
        dispatch({ type: FETCH_TRANSACTION_REQUEST });
    }, [dispatch]);
    const {
        from = [],
        to = [],
        dealReferance = [],
        payment = [],
        senderDetails = [],
        intermidiateBankDetails = [],
        additionalDetails = []
    } = transactionState || {};
   
const handleClose = () => {
    navigate("/")
}



    return (
        <Grid container className='bg-blue-50' spacing={2} sx={{
            p: 3,
            }}>
            <Grid item xs={12}>
                <Card className='border-radius-16 p-6 shadow-none' elevation={1} >
                    <Grid item xs={12} mb={2}>
                        <Text variant='h5'> Select Sender & Beneficiary from the list below </Text>
                    </Grid>
                    <Box className="flex p-2 justify-between gap-4">

                        {from.map((sender, index) => (
                            <Box className='w-2/4 p-3 rounded-md border-dashed' key={index}>
                                <Flex direction="column">
                                    <Text variant="h6" className=" font-medium">From</Text>

                                    <Stack direction="row" alignItems="center" mb={1}>
                                        <Div className="transaction-icons">
                                            <AE size={16} />
                                        </Div>
                                        <Text className="text-with-icon" variant='h5'>Everyday Account</Text>
                                    </Stack>

                                    <Text mb={1} variant='label1'>Daily Expenses</Text>
                                    <Text mb={1} variant='label1'>Current Account: {sender.accountnumber}</Text>

                                    <Stack direction="row" alignItems="center" mb={1}>
                                        <Text variant='label1'>Available Balance:</Text>
                                        <Text variant='button1' ml={0.5}>{sender.balance}</Text>
                                        <Text variant='label1' color='secondary' ml={0.5}>(as of 8 July, 2024, 08:00PM)</Text>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" mb={1}>
                                        <Div className="transaction-icons">
                                            <Bank size={16} />
                                        </Div>
                                        <Text className="text-with-icon" variant='button1'>{sender.branch}</Text>
                                    </Stack>
                                </Flex>

                            </Box>
                        ))}
                        {to.map((recipient, index) => (
                            <Box className='w-2/4 p-3 rounded-md border-dashed' key={index}>

                                <Flex direction="column">
                                    <Text variant='h5' mb={2}>To</Text>
                                    <Stack direction="row" alignItems="center" mb={1}>
                                        <Div className="transaction-icons">
                                            <AE size={16} />
                                        </Div>
                                        <Text className="text-with-icon" variant='h5'>Nazeem Khan</Text>
                                    </Stack>

                                    <Text mb={1} variant='label1'>NazKhan</Text>

                                    <Stack direction="row" alignItems="center" mb={1}>
                                        <Div className="transaction-icons">
                                            <Bank size={16} />
                                        </Div>
                                        <Text className="text-with-icon" variant='button1'>Captial One Bank</Text>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" mb={1}>
                                        <Div className="transaction-icons">
                                            <Bills size={16} />
                                        </Div>
                                        <Text className="text-with-icon" variant='button1'>AE07033123456700000004</Text>
                                    </Stack>
                                </Flex>
                            </Box>
                        ))}
                    </Box>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card className='border-radius-16 shadow-none p-6' elevation={1} >
                    <Grid item xs={12} mb={2}>
                        <Text variant='h5'>Deal Reference </Text>
                    </Grid>


                    <Box>
                        {dealReferance.map((deal, index) => (
                            <Div>

                                <Box className='bg-blue-50 p-3 rounded-t-lg flex justify-between' ><Text variant='label3' className='font-medium'>Deal Reference Code:</Text><Text variant='label3' className='font-medium'>{deal.referenceCode}</Text> </Box>

                                <Divider className='w-auto' />
                                <Box className='bg-blue-50 p-3 rounded-b-lg flex justify-between' ><Text variant='label3' className='font-medium'>Deal Code:</Text><Text variant='label3' className='font-medium'>{deal.dealCode}</Text> </Box>

                            </Div>


                        ))}
                    </Box>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card className='border-radius-16 shadow-none p-6' elevation={1} >
                    <Grid item xs={12} mb={2}>
                        <Text variant='h5'>Payment Details</Text>
                    </Grid>

                    <Div className="">
                        {payment.map((pay, index) => (
                            <Div key={index}>
                                <Box className='bg-blue-50 p-3 rounded-t-lg flex justify-between' ><Text variant='label3' className='font-medium'>Payment to Beneficiary:</Text><Text variant='label3' className='font-medium'>{pay.paymentBenifercy}</Text> </Box>

                                <Divider className='w-auto' />
                                <Box className='bg-blue-50 p-3 flex justify-between' ><Text variant='label3' className='font-medium'>Debit Account:</Text><Text variant='label3' className='font-medium'>{pay.DebitAccount}</Text> </Box>


                                <Divider className='w-auto' />
                                <Box className='bg-blue-50 p-3 flex justify-between' ><Text variant='label3' className='font-medium'>Payment Date:</Text><Text variant='label3' className='font-medium'>{pay.paymentDate}</Text> </Box>
                                <Divider className='w-auto' />
                                <Box className='bg-blue-50 p-3 rounded-b-lg flex justify-between' ><Text variant='label3' className='font-medium'>Value Date:</Text><Text variant='label3' className='font-medium'>{pay.valueDate}</Text> </Box>

                            </Div>
                        ))}
                    </Div>
                    <Box className='flex mt-2'>
                        <Div className='text-blue-700'><InfoIcon className='' /></Div> <Text variant='label3' className='text-gray-500 mt-1'>Your payment will be processed on 18 July 2024</Text>
                    </Box>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card className='border-radius-16 p-6 shadow-none' elevation={1} >
                    <Div className="">
                        {senderDetails.map((senderDetail, index) => (
                            <Div key={index}>
                                <Grid item xs={12} mb={2}>
                                    <Text variant='h5'> Sender Correspondent Details</Text>
                                </Grid>
                                <Box className='bg-blue-50 p-3 rounded-t-lg flex justify-between' ><Text variant='label3' className='font-medium'>Bank Name:</Text><Text variant='label3' className='font-medium'>{senderDetail.bankname}</Text> </Box>
                                <Divider className='w-auto' />
                                <Box className='bg-blue-50 p-3 rounded-b-lg flex justify-between' ><Text variant='label3' className='font-medium'>Bank Detail:</Text><Text variant='label3' className='font-medium'>{senderDetail.bankdetail}</Text> </Box>

                            </Div>
                        ))}

                    </Div>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card className='border-radius-16 p-6 shadow-none' elevation={1} >


                    <Div className="">

                        {intermidiateBankDetails.map((intermediateDetail, index) => (
                            <Div key={index}>
                                <Grid item xs={12} mb={2}>
                                    <Text variant='h5'>Intermediate Bank Details </Text>
                                </Grid>
                                <Box className='bg-blue-50 p-3 rounded-t-lg flex justify-between' ><Text variant='label3' className='font-medium'>Bank Name:</Text><Text variant='label3' className='font-medium'>{intermediateDetail.bankname}</Text> </Box>
                                <Divider className='w-auto' />
                                <Box className='bg-blue-50 p-3 rounded-b-lg flex justify-between' ><Text variant='label3' className='font-medium'>Bank Detail:</Text><Text variant='label3' className='font-medium'>{intermediateDetail.bankdetail}</Text> </Box>

                            </Div>
                        ))}
                    </Div>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card className='border-radius-16 p-6 shadow-none' elevation={1} >
                    <Grid item xs={12} mb={2}>
                        <Text variant='h5'>Additional Details </Text>
                    </Grid>

                    {additionalDetails.map((detail, index) => (
                        <Div key={index}>
                            <Box className='bg-blue-50 p-3 rounded-t-lg flex justify-between' ><Text variant='label3' className='font-medium'>Purpose:</Text><Text variant='label3' className='font-medium'>{detail.purpose}</Text> </Box>
                            <Divider className='w-auto' />
                            <Box className='bg-blue-50 p-3 flex justify-between' ><Text variant='label3' className='font-medium'>Payment Detail:</Text><Text variant='label3' className='font-medium'>{detail.paymentdetail}</Text> </Box>
                            <Divider className='w-auto' />
                            <Box className='bg-blue-50 p-3 flex justify-between' ><Text variant='label3' className='font-medium'>Customer Reference:</Text><Text variant='label3' className='font-medium'>{detail.customerreference}</Text> </Box>
                            <Divider className='w-auto' />
                            <Box className='bg-blue-50 p-3 rounded-b-lg flex justify-between' ><Text variant='label3' className='font-medium'>Authorizer:</Text><Text variant='label3' className='font-medium'>{detail.autheriour}</Text> </Box>

                        </Div>
                    ))}
                </Card>
                <Box className='flex justify-end'>
                <Button color='secondary' onClick={handleClose} className='mt-4' size='medium'>Close</Button>

                </Box>
            </Grid>

        </Grid>
    );
};

export default PaymentDetails;



/transaction?trid=${params.row.transactionId}



{
  "debitAccountId": {
    "_id": {},
    "accountNumber": "223456789",
    "accountName": "Michael Johnson",
    "accountType": "Current",
    "currencyCode": "AED",
    "balance": "10000.00"
  },
  "beneficiaryId": {
    "_id": {},
    "beneficiaryReferenceId": "BEN002",
    "beneficiaryAccountType": "Savings",
    "beneficiaryAccountNumber": "123654789",
    "beneficiaryIBAN": "AE123456789",
    "beneficiaryName": "Alice Brown",
    "beneficiaryNickName": "Alice",
    "beneficiaryBankName": "Emirates NBD",
    "beneficiaryCountry": "UAE",
    "currencyCode": "AED",
    "beneficiaryAddress": "456 Oak St, Dubai, UAE",
    "phoneNumber": "+971-567-8901",
    "email": "alice.brown@example.com",
    "createdAt": "2024-07-03T00:00:00.000Z",
    "createdBy": "system",
    "updatedAt": "2024-07-04T00:00:00.000Z",
    "updatedBy": "system"
  },
  "paymentDetails": {
    "paymentDate": "2024-08-02T00:00:00.000Z",
    "valueDate": "2024-08-03T00:00:00.000Z",
    "chargeType": "SHA",
    "debitedAmount": 5000,
    "paymentAmount": 5000
  },
  "debitAccount": {
    "_id": {},
    "accountNumber": "223456789",
    "accountName": "Michael Johnson",
    "accountType": "Current",
    "currencyCode": "AED",
    "balance": "10000.00"
  },
  "senderCorrespondentDetails": {
    "intermediaryBank": {
      "bankName": "Abu Dhabi Commercial Bank",
      "bankDetails": "UAE"
    },
    "correspondentBank": {
      "bankName": "Barclays Bank",
      "bankDetails": "UK"
    }
  },
  "additionalDetails": {
    "purposeOfTransfer": "ACM: Agency Commissions",
    "paymentDetails": "Payment for monthly salary.",
    "customerReference": "CR002",
    "authoriser": "Admin"
  }
}
