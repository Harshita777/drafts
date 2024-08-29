import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, Grid, Text, Div, Tag, DataGrid, IconButton } from '@enbdleap/react-ui';
import { useNavigate } from 'react-router-dom';
import { FETCH_TRANSACTION_SUMMARY_REQUEST } from '../../../redux/actions/DashboardActions';
import { statusTags, transactionSummaryColumns } from '../../../config/config';
import { infoStore } from '../../../services/infoStore';

// Define the interface for the component props
interface PendingActivitiesProps {
	transferType: string;
}

// Main component definition
const PendingActivities: React.FC<PendingActivitiesProps> = ({ transferType }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Accessing the transaction summary state from the Redux store
	const transactionSummaryState = useSelector((state: any) => state.transactionSummaryReducer);

	// Getting userId from a custom info store service
	const subscriberId = infoStore.getSubscriberId();

	// Fetch transaction summary data when the component mounts or when the userId changes
	useEffect(() => {
		if (subscriberId) {
			dispatch({ type: FETCH_TRANSACTION_SUMMARY_REQUEST, payload: { subscriberId } });
		}
	}, [dispatch, subscriberId]);

	// Handle row click based on the status and transaction type
	const handleCellClick = (params: any) => {
		if (params.row && params.row.status && params.row.status.label) {
			const status = params.row.status?.label;
			const type = params.row.fileType;
			const typeUrl = type.toString().toLowerCase().split(' ').join('-');
			const rfid = params.row.referenceId;

			// Redirecting based on the transaction type and status
			if (status === 'Ready for Verification' && type === "File Upload") {
				navigate(`/dashboard/payments/file-verify`, { state: rfid });
			} else if (status === 'Pending Authorization' && (type === "Telegraphic Transfer" || type === "Within Bank Transfer")) {
				navigate(`/dashboard/payments/${typeUrl}?rfId=${rfid}`);
			} else if (status === 'Pending Authorization' && type === "File Upload") {
				navigate(`/dashboard/payments/within-bank-transfer?rfId=${rfid}&type=${typeUrl}`);
			}
		}
	};

	// Filter the data based on the transfer type
	const filteredData = transactionSummaryState.data || [];
	const allTransactions = filteredData.filter((item: any) =>
		(item.transactionType.name.includes("Telegraphic Transfer") ||
			item.transactionType.name.includes("Within Bank Transfer") ||
			item.transactionType.name.includes("File Upload")) &&
		(item.transactionStatus.status === 'Pending Authorization' ||
			item.transactionStatus.status === 'Ready for Verification')
	);

	// Further filter rows based on the selected transfer type
	const filteredRows = allTransactions.filter((item: any) => {
		if (transferType === 'All') {
			return true;
		} else if (transferType === 'Within Bank Transfer') {
			return item.transactionType.name.includes("File Upload") ||
				item.transactionType.name.includes("Within Bank Transfer");
		} else if (transferType === 'Telegraphic Transfer') {
			return item.transactionType.name.includes("Telegraphic Transfer");
		}
		return false;
	}).map((item: any, index: number) => ({
		id: index + 1,
		date: item.submittedAt,
		amount: item.paymentDetails?.paymentAmount,
		customer: item.additionalDetails.customerReference,
		fileType: item.transactionType?.name,
		status: statusTags[item.transactionStatus.status],
		transactionId: item.transactionId,
		referenceId: item.referenceId,
		total: "-",
		rejection: item.comment || "-"
	}));

	// Utility function to count rows by status
	const countByStatus = (status: string) =>
		filteredRows.filter((item: any) => item.status.label === status).length;

	// DataGrid props configuration
	const GridTableProps = {
		rows: filteredRows.reverse(),
		columns: [
			...transactionSummaryColumns,
			{
				field: 'status',
				width: 190,
				headerName: 'Status',
				renderCell: (params: any) => (
					<div>
						<Tag sx={{ maxWidth: '160px' }} size='medium' type={params?.value?.type} label={params?.value?.label} />
					</div>
				),
			},
			{
				field: 'rejection',
				flex: 1,
				headerName: 'Comments',
			}
		],
		hidePagination: false,
		checkboxSelection: false,
		autoPageSize: false,
		disableColumnMenu: true,
		autoHeight: true,
		onRowClick: handleCellClick,
		disableColumnFilter: false,
		hideFooterRowCount: false,
	};

	const paymentSummaryDetails = [
		{
			category: 'all',
			title: 'All Transactions',
			count: transactionSummaryState.allTransaction,
			amount: transactionSummaryState.allAmount,
		},
		{
			category: 'single',
			title: 'Single Transactions',
			count: transactionSummaryState.individualTransaction,
			amount: transactionSummaryState.individualAmount,
		},
		{
			category: 'file-upload',
			title: 'File Transactions',
			count: transactionSummaryState.filesTransaction,
			amount: transactionSummaryState.fileAmount,
		}
	];

	return (
		<>
			{/* Summary header section */}
			<Grid container className='w-full h-auto shadow-bottom' margin={0}>
				<Card className='bg-blue-50 w-full flex justify-between'></Card>
			</Grid>

			{/* Main content grid layout */}
			<Grid container spacing={2} className='px-7 mt-28'>
				<Grid item xs={12}>
					<Box className='flex gap-5'>
						{paymentSummaryDetails.map((detail, index) => (
							<Card
								key={index}
								className={`shadow-none border-solid w-full border mt-2 p-3 cursor-pointer rounded-lg`}
							// onClick={() => filteredData(detail.category)}
							>
								<Div className='flex justify-between'>
									<Div>
										<Text variant='label2' className='text-gray-500 font-medium'>
											{detail.title}
										</Text>
										<Div className='flex justify-between'>
											<Text variant='label2' className='text-md mt-3 font-semibold text-gray-500'>
												{detail.amount} AED
											</Text>
										</Div>
									</Div>

									<Box className='flex justify-between items-center'>
										<Text variant='h3' className='font-semibold font-xl'>
											{detail.count}  <Text variant='label2' className='text-md mt-3 font-semibold text-gray-500'>
												Transactions
											</Text>
										</Text>
									</Box>
								</Div>


							</Card>
						))}
					</Box>
				</Grid>

				{/* Data Grid Section */}
				<Grid item xs={12} className='mb-4'>
					<Card className='shadow-none p-4 h-auto border rounded-1xl' elevation={3}>
						<Box className='flex justify-between'>
							<Text variant='h4' className='mt-4 font-medium'>
								Transactions Summary
							</Text>
						</Box>
						<Text variant='label1' className='text-gray-400'>
							Showing 1 - 10 out of {filteredRows.length}
						</Text>

						{/* Display the data grid if there are rows to show */}
						{filteredRows.length > 0 && (
							<DataGrid
								initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
								className='mt-4 text-gray-600 border-none  z-0 cursor-pointer '
								{...GridTableProps}
							/>
						)}
					</Card>
				</Grid>
			</Grid>
		</>
	);
};

export default PendingActivities;






{
    "data": [
        {
            "debitedAmount": "1",
            "paymentAmount": "2",
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O4o_wNyL9JXiaX5JbdU",
            "referenceId": "DEW1724237989437UTL",
            "initiateDate": "2024-08-21T10:59:31.002Z"
        },
        {
            "debitedAmount": "1",
            "paymentAmount": "2",
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O4o_xBN_v7BmNuzTHHD",
            "referenceId": "DEW1724237992728UTL",
            "initiateDate": "2024-08-21T10:59:31.002Z"
        },
        {
            "debitedAmount": "1",
            "paymentAmount": "2",
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Rejected"
            },
            "transactionId": "-O4o_zxt8EjF_zjyi5dZ",
            "referenceId": "DEW1724238004088UTL",
            "initiateDate": "2024-08-21T10:59:31.002Z"
        },
        {
            "debitedAmount": "100",
            "paymentAmount": "100",
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Rejected"
            },
            "transactionId": "-O4oa911C2DhRxszY-Dq",
            "referenceId": "DEW1724238045314UTL",
            "initiateDate": "2024-08-21T11:00:07.279Z"
        },
        {
            "debitedAmount": "2",
            "paymentAmount": "2",
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Approved"
            },
            "transactionId": "-O4oaOmxrmG165-GcPUr",
            "referenceId": "DEW1724238109885UTL",
            "initiateDate": "2024-08-21T11:01:30.097Z"
        },
        {
            "debitedAmount": "1",
            "paymentAmount": "2",
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Approved"
            },
            "transactionId": "-O4otDBYJWHaFlwONxyc",
            "referenceId": "DEW1724243043107UTL",
            "initiateDate": "2024-08-22T12:23:26.000Z"
        },
        {
            "debitedAmount": "1",
            "paymentAmount": "2",
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Rejected"
            },
            "transactionId": "-O4ovUUxfCwgSdypk8Zi",
            "referenceId": "DEW1724243638268UTL",
            "initiateDate": "2024-08-23T12:32:53.000Z"
        },
        {
            "debitedAmount": "1",
            "paymentAmount": "2",
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Rejected"
            },
            "transactionId": "-O4oxWfe7iIRCVvbzzyW",
            "referenceId": "DEW1724244171498UTL",
            "initiateDate": "2024-08-22T12:42:26.000Z"
        },
        {
            "debitedAmount": "1",
            "paymentAmount": "2",
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4oyBRd2IHz9Jj02g7c",
            "referenceId": "DEW1724244346665UTL",
            "initiateDate": "2024-08-25T12:45:20.000Z"
        },
        {
            "debitedAmount": "1",
            "paymentAmount": "1",
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4p0ZhkyBEmxBX49ebK",
            "referenceId": "DEW1724245232496UTL",
            "initiateDate": "2024-08-23T13:00:00.000Z"
        },
        {
            "debitedAmount": "1990",
            "paymentAmount": "1500",
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "paymentCurrency": "GBP",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O4pSZ4WqGPlqFnTmp35",
            "referenceId": "DEW1724252569953UTL",
            "initiateDate": "2024-08-24T14:59:41.000Z"
        },
        {
            "debitedAmount": "2345",
            "paymentAmount": "2500",
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Rejected"
            },
            "transactionId": "-O4pYLTPNZtmYNO_6BwQ",
            "referenceId": "DEW1724254087066UTL",
            "initiateDate": "2024-08-22T15:27:12.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "debitedAmount": "1111111",
            "paymentAmount": "111111111",
            "transactionId": "-O4qEHHtDtWYSs8Df0i9",
            "referenceId": "DEW1724265604281UTL",
            "initiateDate": "2024-08-29T18:39:16.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "debitedAmount": "100",
            "paymentAmount": "200",
            "paymentCurrency": "AED",
            "transactionId": "-O4qFbYoIc1k3pn1Pl-Q",
            "referenceId": "DEW1724265953524UTL",
            "initiateDate": "2024-08-23T18:44:57.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "debitedAmount": "1",
            "paymentAmount": "2",
            "paymentCurrency": "AED",
            "transactionId": "-O4qI47fgMHXjCyj_edD",
            "referenceId": "DEW1724266598955UTL",
            "initiateDate": "2024-08-22T18:56:03.000Z"
        },
        {
            "debitedAmount": "1",
            "paymentAmount": "1",
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4sR2okZ5AZ9lWLqj-F",
            "referenceId": "DEW1724302507311UTL",
            "initiateDate": "2024-08-23T04:53:35.000Z"
        },
        {
            "debitedAmount": "10000",
            "paymentAmount": "3000",
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O4tCVasFu3G2yT-7D62",
            "referenceId": "DEW1724315470263UTL",
            "initiateDate": "2025-08-23T08:14:47.000Z"
        },
        {
            "debitedAmount": "1000",
            "paymentAmount": "1500",
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O4tHACZ9poQcCqo5g8w",
            "referenceId": "DEW1724316693348UTL",
            "initiateDate": "2024-08-24T08:36:25.000Z"
        },
        {
            "debitedAmount": "100",
            "paymentAmount": "100",
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4tpuDw8klO5zUM83Kk",
            "referenceId": "DEW1724326060988UTL",
            "initiateDate": "2024-08-24T11:26:58.000Z"
        },
        {
            "debitedAmount": "1",
            "paymentAmount": "1",
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4ty76QD6ubIpDZOg-a",
            "referenceId": "DEW1724328215003UTL",
            "initiateDate": "2024-08-24T11:59:13.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "debitedAmount": "1000",
            "paymentCurrency": "GBP",
            "transactionId": "-O4u-_XKJagARVyZUo-v",
            "referenceId": "DEW1724328859797UTL"
        },
        {
            "debitedAmount": "10000",
            "paymentAmount": "10000",
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4uAtmoGBBbYOlYanJI",
            "referenceId": "DEW1724331826356UTL",
            "initiateDate": "2024-08-23T13:02:33.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "paymentCurrency": "USD",
            "transactionId": "-O4uEOR_Lwza5_mVCVnN",
            "referenceId": "DEW1724332742437UTL"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "paymentCurrency": "USD",
            "transactionId": "-O4uIuDIeGj26EU_hiGX",
            "referenceId": "DEW1724333925267UTL"
        },
        {
            "debitedAmount": "2000",
            "paymentAmount": "2000",
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4uS6ORY2ys4BADB3fq",
            "referenceId": "DEW1724336338523UTL",
            "initiateDate": "2024-08-24T14:15:53.000Z"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000023",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10038",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000023",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10034",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000023",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10035",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000025",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10044",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000027",
            "paymentAmount": 24,
            "debitedAmount": 24,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10054",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000025",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10046",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000025",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10048",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000023",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10036",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000023",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10037",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000027",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10051",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000027",
            "paymentAmount": 4234,
            "debitedAmount": 4234,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10055",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000027",
            "paymentAmount": 242,
            "debitedAmount": 242,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10057",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000027",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10052",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000027",
            "paymentAmount": 64387,
            "debitedAmount": 64387,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10053",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000025",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10047",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000023",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10039",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000023",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10040",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000023",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10041",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000025",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10042",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000025",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10043",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000025",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10045",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000025",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10049",
            "initiateDate": "Thu Aug 22 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000027",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10056",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "debitedAmount": "1",
            "paymentAmount": "1",
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4vHqnqQUFdEqaT23jx",
            "referenceId": "DEW1724350426358UTL",
            "initiateDate": "2024-08-23T18:12:17.000Z"
        },
        {
            "debitedAmount": "1",
            "paymentAmount": "2",
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4vJWLeJURC6IqIir9p",
            "referenceId": "DEW1724350862762UTL",
            "initiateDate": "2024-08-24T18:20:09.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "paymentCurrency": "USD",
            "debitedAmount": "1",
            "paymentAmount": "2",
            "transactionId": "-O4vMxI6bZ_R3j4zD0yh",
            "referenceId": "DEW1724351763655UTL",
            "initiateDate": "2024-08-23T12:32:53.000Z"
        },
        {
            "debitedAmount": 1,
            "paymentAmount": 1,
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4vPfOD81No6-4r1ins",
            "referenceId": "DEW1724352476750UTL",
            "initiateDate": "2024-08-23T18:47:06.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "debitedAmount": 2,
            "paymentAmount": 2,
            "paymentCurrency": "USD",
            "transactionId": "-O4vQDMVIVifpjceSF_8",
            "referenceId": "DEW1724352620000UTL",
            "initiateDate": "2024-08-23T18:47:06.000Z"
        },
        {
            "debitedAmount": "3000",
            "paymentAmount": "30000",
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4vZzRIazd5MBuyVcVe",
            "referenceId": "DEW1724355180307UTL",
            "initiateDate": "2024-08-23T19:30:15.000Z"
        },
        {
            "debitedAmount": "5050",
            "paymentAmount": "5050",
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4vaWfzLMd53YRw5PRO",
            "referenceId": "DEW1724355582719UTL",
            "initiateDate": "2024-08-22T19:38:45.000Z"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000028",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10058",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000028",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10059",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000028",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10060",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000028",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10061",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000028",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10062",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000028",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10063",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000028",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10064",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000028",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10065",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 1,
            "paymentAmount": 1,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4vhUWkWTUp_oQxPVHw",
            "referenceId": "DEW1724357408880UTL",
            "initiateDate": "2024-08-23T20:09:36.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 19,
            "paymentAmount": 20,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4vlOaqh13w7SU5qa7k",
            "referenceId": "DEW1724358433205UTL",
            "initiateDate": "2024-08-27T20:09:36.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 1,
            "paymentAmount": 2,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4vmHcZS_q_2kqPNiTx",
            "referenceId": "DEW1724358666788UTL",
            "initiateDate": "2024-08-30T20:30:12.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 10,
            "paymentAmount": 20,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4voX0jJNxhHPaK5QEI",
            "referenceId": "DEW1724359254127UTL",
            "initiateDate": "2024-08-26T20:30:12.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "DEW1724350426358UTL",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10066",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000040",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10067",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000040",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10068",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000040",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10069",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000040",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10070",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000040",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10071",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000040",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10072",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "paymentCurrency": "USD",
            "referenceId": "10000040",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10073",
            "initiateDate": "Fri Aug 23 2024 00:00:00 GMT+0530 (India Standard Time)"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 2000,
            "paymentAmount": 20000,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4yhl1Rc31CSxF4Qr8z",
            "referenceId": "DEW1724407812252UTL",
            "initiateDate": "2024-08-31T10:09:12.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000042",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10074",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000042",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10075",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000042",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10076",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000042",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10077",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000042",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10078",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000042",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10079",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000042",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10080",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000042",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10081",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 2000,
            "paymentAmount": 2000,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4yrGgJCDLE4h0NuFET",
            "referenceId": "DEW1724410305299UTL",
            "initiateDate": "2024-08-31T10:50:53.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 111,
            "paymentAmount": 222,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O4yrhIZ8XYfC4PB-aPG",
            "referenceId": "DEW1724410418404UTL",
            "initiateDate": "2024-08-27T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 1000,
            "paymentAmount": 1000,
            "paymentCurrency": "GBP",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O4ywXXcdad2K76WG3nE",
            "referenceId": "DEW1724411685032UTL",
            "initiateDate": "2024-08-30T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000043",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10082",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000043",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10083",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000043",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10084",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000043",
            "paymentAmount": 64387,
            "debitedAmount": 64387,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10085",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000043",
            "paymentAmount": 24,
            "debitedAmount": 24,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10086",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000043",
            "paymentAmount": 4234,
            "debitedAmount": 4234,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10087",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000043",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10088",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000043",
            "paymentAmount": 242,
            "debitedAmount": 242,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10089",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000045",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10090",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000045",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10091",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000045",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10092",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000045",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10093",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000045",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10094",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000045",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10095",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000045",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10096",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000045",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10097",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": -5,
            "paymentAmount": -4,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5-CYH7JwBJet_mLpRq",
            "referenceId": "DEW1724432921736UTL",
            "initiateDate": "2024-12-12T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000047",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10098",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000047",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10099",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000047",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10100",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000047",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10101",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000047",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10102",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000047",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10103",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000047",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10104",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000047",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10105",
            "initiateDate": "2024-08-22T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 2000,
            "paymentAmount": 2000,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5-Qg-kNnu4Fu2Ce5el",
            "referenceId": "DEW1724436627504UTL",
            "initiateDate": "2024-08-23T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 5050,
            "paymentAmount": 5005,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5-RuhMd27TxbKrbbr1",
            "referenceId": "DEW1724436949847UTL",
            "initiateDate": "2024-09-02T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 4040,
            "paymentAmount": 4004,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5-XY4OsEcMhpHscz6o",
            "referenceId": "DEW1724438425945UTL",
            "initiateDate": "2024-09-02T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 3000,
            "paymentAmount": 3000,
            "paymentCurrency": "GBP",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5-b6cg2NdzDNQViY5Q",
            "referenceId": "DEW1724439624236UTL",
            "initiateDate": "2024-09-02T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 10,
            "paymentAmount": 12,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O51ttx3zVhwFHEjp11Y",
            "referenceId": "DEW1724478103364UTL",
            "initiateDate": "2024-08-26T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 300,
            "paymentAmount": 3000,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O52aCh2Ks8niWqJGhAR",
            "referenceId": "DEW1724489718595UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000050",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10106",
            "initiateDate": "2024-08-30T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 1000,
            "paymentAmount": 1000,
            "paymentCurrency": "GBP",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O53a4BuV43bQtBRVKm2",
            "referenceId": "DEW1724506460986UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 700,
            "paymentAmount": 9087,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O54Jcw8pPDVCQT8pV7f",
            "referenceId": "DEW1724518665992UTL",
            "initiateDate": "2024-08-23T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 76,
            "paymentAmount": 90,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O54JuVtck1ySyEX-DnE",
            "referenceId": "DEW1724518737977UTL",
            "initiateDate": "2024-08-24T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 100,
            "paymentAmount": 112,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O54Nh23Usx8o2nFqmJl",
            "referenceId": "DEW1724519731395UTL",
            "initiateDate": "2024-09-28T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000058",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10107",
            "initiateDate": "2024-08-24T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000059",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10108",
            "initiateDate": "2024-08-24T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000060",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10109",
            "initiateDate": "2024-08-24T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 1,
            "paymentAmount": 1,
            "paymentCurrency": "GBP",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O57Rw39dv0oNoAZjGk5",
            "referenceId": "DEW1724571173130UTL",
            "initiateDate": "2024-08-25T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 1,
            "paymentAmount": 1,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O57Ux46lTECWiMuOqPp",
            "referenceId": "DEW1724571963719UTL",
            "initiateDate": "2024-08-25T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 1,
            "paymentAmount": 1,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O57shRtNEkXkUXrmKjh",
            "referenceId": "DEW1724578453305UTL",
            "initiateDate": "2024-08-26T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 1,
            "paymentAmount": 1,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O57uPGSBArqyFHXWqOP",
            "referenceId": "DEW1724578899037UTL",
            "initiateDate": "2024-08-25T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 100,
            "paymentAmount": 112,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O57u_H-MpTY3Ibu0Rfi",
            "referenceId": "DEW1724578944127UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 113,
            "paymentAmount": 115,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O57uwFFjuMEJKCpuBZB",
            "referenceId": "DEW1724579038224UTL",
            "initiateDate": "2024-08-27T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 114,
            "paymentAmount": 115,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O57vYBIpqJ36drqNFzt",
            "referenceId": "DEW1724579197715UTL",
            "initiateDate": "2024-08-27T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 123,
            "paymentAmount": 123,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O57w-e3LNxsgSaigpCY",
            "referenceId": "DEW1724579318404UTL",
            "initiateDate": "2024-08-28T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000061",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10110",
            "initiateDate": "2024-08-24T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 1,
            "paymentAmount": 1,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O57yZmLJd9MJ8dmoszQ",
            "referenceId": "DEW1724579990678UTL",
            "initiateDate": "2024-08-25T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 112,
            "paymentAmount": 112,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O57yc7_64DhhQhykE4Y",
            "referenceId": "DEW1724580004389UTL",
            "initiateDate": "2024-08-27T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 11,
            "paymentAmount": 8,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O57z29-Hh0HQ2wRxR4L",
            "referenceId": "DEW1724580115072UTL",
            "initiateDate": "2024-08-28T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 12,
            "paymentAmount": 11,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O57zqdKfd_qGzglHTq4",
            "referenceId": "DEW1724580325973UTL",
            "initiateDate": "2024-08-30T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 112,
            "paymentAmount": 111,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O583014j_Ma9YP7VpSp",
            "referenceId": "DEW1724581417092UTL",
            "initiateDate": "2024-08-28T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 12,
            "paymentAmount": 12,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O583hf8GyiBLcKxeg3Z",
            "referenceId": "DEW1724581599945UTL",
            "initiateDate": "2024-08-27T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 123,
            "paymentAmount": 12,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O584CQn-EQYmjZ-jmgi",
            "referenceId": "DEW1724581730035UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 123,
            "paymentAmount": 121,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O584oIrxacEmir7XDGd",
            "referenceId": "DEW1724581889271UTL",
            "initiateDate": "2024-08-28T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 12,
            "paymentAmount": 12,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O586blkI1SNI3H8iXaV",
            "referenceId": "DEW1724582362224UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 1,
            "paymentAmount": 1,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O587Eyl6NCoHRnDgCeq",
            "referenceId": "DEW1724582526897UTL",
            "initiateDate": "2024-08-26T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 12,
            "paymentAmount": 12,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O587Rn3Q09ltTBySOZ9",
            "referenceId": "DEW1724582579396UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 121,
            "paymentAmount": 12,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O588C5YJYir7KurHtAW",
            "referenceId": "DEW1724582777251UTL",
            "initiateDate": "2024-08-26T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 1,
            "paymentAmount": 1,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O588KNUr2n8DMCtGY6Q",
            "referenceId": "DEW1724582811167UTL",
            "initiateDate": "2024-08-26T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 1,
            "paymentAmount": 1,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O589mtMmYAjlA0RTXEH",
            "referenceId": "DEW1724583194199UTL",
            "initiateDate": "2024-08-26T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000062",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10111",
            "initiateDate": "2024-08-24T13:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 85.3994,
            "paymentAmount": 20,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O595MNLoGHSKxXiUKIp",
            "referenceId": "DEW1724598810134UTL",
            "initiateDate": "2024-08-25T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 20,
            "paymentAmount": 17.11019134326979,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O595qCOH5duHpKVJSEp",
            "referenceId": "DEW1724598936409UTL",
            "initiateDate": "2024-08-26T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000063",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10112",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000064",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10113",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000066",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10114",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000067",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10115",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000067",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10116",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 9.06785,
            "paymentAmount": 10,
            "paymentCurrency": "GBP",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O59q8e2MiLYXqd-LWOX",
            "referenceId": "DEW1724611336835UTL",
            "initiateDate": "2024-08-28T10:16:53.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000068",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10117",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 213.49849999999998,
            "paymentAmount": 50,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Rejected"
            },
            "transactionId": "-O59rKxNaW0SxjD1DSmg",
            "referenceId": "DEW1724611649368UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000069",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10118",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000070",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10119",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000071",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10120",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000072",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10121",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "GBP",
            "referenceId": "10000073",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10122",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000074",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10123",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000075",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10124",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000076",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10125",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000077",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10126",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000078",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10127",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000079",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10128",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000080",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10129",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "USD",
            "referenceId": "10000080",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10130",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 11.63238,
            "paymentAmount": 10,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5CPMNqr-qGybz-HsCt",
            "referenceId": "DEW1724654384694UTL",
            "initiateDate": "2024-08-28T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 11.63641,
            "paymentAmount": 10,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5CR7V42GLhaiRezC1k",
            "referenceId": "DEW1724654848005UTL",
            "initiateDate": "2024-08-28T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 12.790106999999999,
            "paymentAmount": 11,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5CUDahpt85EZru1QxP",
            "referenceId": "DEW1724655659437UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 9.02912,
            "paymentAmount": 10,
            "paymentCurrency": "GBP",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5CttXmWJ9nwdYAZ5na",
            "referenceId": "DEW1724662651058UTL",
            "initiateDate": "2024-08-30T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 11.625350000000001,
            "paymentAmount": 10,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5Cz9eLeHPHxOHONS9E",
            "referenceId": "DEW1724664031894UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 11.627369999999999,
            "paymentAmount": 10,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O5D-uBF7ue6OCMJsvx6",
            "referenceId": "DEW1724664488720UTL",
            "initiateDate": "2024-08-30T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 11.62636,
            "paymentAmount": 10,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5D0W3Vo0cGBrSC2yIc",
            "referenceId": "DEW1724664647968UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "GBP",
            "referenceId": "10000081",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10131",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "GBP",
            "referenceId": "10000081",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10132",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "GBP",
            "referenceId": "10000082",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10133",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "GBP",
            "referenceId": "10000082",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10134",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 11.627369999999999,
            "paymentAmount": 10,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5D53M-PUzKRLFCQx_T",
            "referenceId": "DEW1724665841088UTL",
            "initiateDate": "2024-08-28T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000083",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10135",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000083",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10136",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000084",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10137",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000084",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10138",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000085",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10139",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000085",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10140",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 11.611279999999999,
            "paymentAmount": 10,
            "paymentCurrency": "USD",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5HnDoGHvt0BpZRPtk9",
            "referenceId": "DEW1724744789265UTL",
            "initiateDate": "2024-08-28T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 10.796148,
            "paymentAmount": 12,
            "paymentCurrency": "GBP",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5IhThVsnNoD20W13gq",
            "referenceId": "DEW1724760058720UTL",
            "initiateDate": "2024-08-26T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000087",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10143",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000087",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10144",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000088",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10145",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000088",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10146",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 10.790856,
            "paymentAmount": 12,
            "paymentCurrency": "GBP",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5K74hdBpeubm1c9XOw",
            "referenceId": "DEW1724783811433UTL",
            "initiateDate": "2024-08-27T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 1211,
            "paymentAmount": 324324,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5KaZPwDWoO20PQsfY0",
            "referenceId": "DEW1724791801532UTL",
            "initiateDate": "2024-08-28T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 1272.48,
            "paymentAmount": 300,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5MFw6Tbkn_yv-oXx3F",
            "referenceId": "DEW1724819685854UTL",
            "initiateDate": "2024-09-02T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 508.992,
            "paymentAmount": 120,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O5MGYoT3-G_FCALMHiL",
            "referenceId": "DEW1724819848478UTL",
            "initiateDate": "2024-09-09T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000089",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10147",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000089",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10148",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000089",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10149",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000089",
            "paymentAmount": 64387,
            "debitedAmount": 64387,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10150",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000089",
            "paymentAmount": 24,
            "debitedAmount": 24,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10151",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000089",
            "paymentAmount": 4234,
            "debitedAmount": 4234,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10152",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000089",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10153",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000089",
            "paymentAmount": 242,
            "debitedAmount": 242,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10154",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000090",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10155",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000090",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10156",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000090",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10157",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000090",
            "paymentAmount": 64387,
            "debitedAmount": 64387,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10158",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000090",
            "paymentAmount": 24,
            "debitedAmount": 24,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10159",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000090",
            "paymentAmount": 4234,
            "debitedAmount": 4234,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10160",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000090",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10161",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000090",
            "paymentAmount": 242,
            "debitedAmount": 242,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10162",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000091",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10163",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000091",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10164",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000092",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10165",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000092",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10166",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 10,
            "paymentAmount": 10,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O5MgUZg__exnOwNF36q",
            "referenceId": "DEW1724826908971UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 846.7040000000001,
            "paymentAmount": 200,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Rejected"
            },
            "transactionId": "-O5MhlXYgrEpJQ377FUa",
            "referenceId": "DEW1724827244707UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000093",
            "paymentAmount": 2500,
            "debitedAmount": 2500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10167",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000093",
            "paymentAmount": 2500,
            "debitedAmount": 2500,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10168",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000094",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10169",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000094",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10170",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000095",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10171",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000095",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10172",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 0,
            "paymentAmount": 200,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5NX4gbT8jRDV0ccvLA",
            "referenceId": "DEW1724840958759UTL",
            "initiateDate": "2024-08-27T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 8455.28,
            "paymentAmount": 2000,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O5NXysh1H32AkhPgLeG",
            "referenceId": "DEW1724841193005UTL",
            "initiateDate": "2024-08-27T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000096",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10173",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000096",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10174",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000097",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10175",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000097",
            "paymentAmount": 1500,
            "debitedAmount": 1500,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10176",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000098",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10177",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000098",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10178",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000099",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10179",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000099",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10180",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 42.302099999999996,
            "paymentAmount": 10,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O5R_ZTMW9kCeRUncY1V",
            "referenceId": "DEW1724908980119UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 100,
            "paymentAmount": 23.639488346914224,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Rejected"
            },
            "transactionId": "-O5Ra5raeaSjFcafr7zH",
            "referenceId": "DEW1724909120998UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000100",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10181",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000100",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10182",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 4230.209999999999,
            "paymentAmount": 1000,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O5RbF67AWsZ8bSBsyKR",
            "referenceId": "DEW1724909421000UTL",
            "initiateDate": "2024-08-28T20:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": -1000,
            "paymentAmount": 1000,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5RjzvXpLeqgNkmB_DP",
            "referenceId": "DEW1724911714018UTL",
            "initiateDate": "2024-08-28T20:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": -1000,
            "paymentAmount": -1000,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5Rk49-ZRh49s2a1Sy6",
            "referenceId": "DEW1724911735424UTL",
            "initiateDate": "2024-08-28T20:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": -1000,
            "paymentAmount": -1000,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5RlM9gxTNXzs7VM5WN",
            "referenceId": "DEW1724912071340UTL",
            "initiateDate": "2024-08-28T20:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 0,
            "paymentAmount": 1000,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O5RpUMh-c046CFmIowz",
            "referenceId": "DEW1724913153516UTL",
            "initiateDate": "2024-08-28T20:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 0,
            "paymentAmount": 500000,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5RrYcpB1r7MC40zvmr",
            "referenceId": "DEW1724913695285UTL",
            "initiateDate": "2024-08-28T20:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 3.679,
            "paymentAmount": 1,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O5S-5092HyZTpDw1Slx",
            "referenceId": "DEW1724915933258UTL"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 1,
            "paymentAmount": 1,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O5S5TqikKcb_UVfzcfn",
            "referenceId": "DEW1724917607854UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000101",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10183",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000101",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "10184",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": -1000,
            "paymentAmount": -1000,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5SMh00rggvFeuV0TvO",
            "referenceId": "DEW1724922122305UTL",
            "initiateDate": "2024-08-28T20:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": -1000,
            "paymentAmount": -1000,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5SN1I__bg2F29dOY7M",
            "referenceId": "DEW1724922209509UTL",
            "initiateDate": "2024-08-28T20:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 10,
            "paymentAmount": 10,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5SwTfEO7JgfP2CSZbq",
            "referenceId": "DEW1724931762894UTL",
            "initiateDate": "2024-08-30T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000103",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10185",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000103",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10186",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000104",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10187",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000104",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10188",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000105",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10189",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000105",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10190",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000106",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10191",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000107",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10192",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000108",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10193",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000108",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10194",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000109",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10195",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000109",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10196",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 842.002,
            "paymentAmount": 200,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Rejected"
            },
            "transactionId": "-O5TDJzZ6eVbx3DWwgTM",
            "referenceId": "DEW1724936441828UTL",
            "initiateDate": "2024-08-28T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 4211.85,
            "paymentAmount": 1000,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Sent to Bank"
            },
            "transactionId": "-O5TEysVGdFCai49p_EV",
            "referenceId": "DEW1724936875552UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000115",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10197",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000115",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10198",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000118",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10199",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000118",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10200",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Within Bank Transfer"
            },
            "debitedAmount": 117.74672,
            "paymentAmount": 28,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5TbQ6TapYM3NvzIUhU",
            "referenceId": "DEW1724943020510UTL",
            "initiateDate": "2024-08-29T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000120",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10201",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "INR",
            "referenceId": "10000120",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Ready for Verification"
            },
            "transactionId": "10202",
            "initiateDate": "2024-08-20T00:00:00.000Z"
        },
        {
            "transactionType": {
                "name": "Telegraphic Transfer"
            },
            "debitedAmount": 20,
            "paymentAmount": 10,
            "paymentCurrency": "AED",
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "-O5Thzd40es4mqBK66zg",
            "referenceId": "DEW1724944742980UTL",
            "initiateDate": "2024-08-30T18:30:00.000Z"
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000121",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10203",
            "initiateDate": null
        },
        {
            "transactionType": {
                "name": "File Upload"
            },
            "paymentCurrency": "AED",
            "referenceId": "10000121",
            "paymentAmount": 150,
            "debitedAmount": 150,
            "transactionStatus": {
                "status": "Pending Authorization"
            },
            "transactionId": "10204",
            "initiateDate": null
        }
    ],
    "allTransaction": 280,
    "individualTransaction": 112,
    "filesTransaction": 130
}
