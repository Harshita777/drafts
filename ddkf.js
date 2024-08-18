import React, { useState, useEffect } from 'react';
import {
    Text, Modal, Box, Card, Flex, IconButton, Input, FormGroup, FormControlLabel, Checkbox, Button, Select, MenuItem, Dialog
} from '@enbdleap/react-ui';
import { Autocomplete, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { GET_USER_ENTITLEMENT } from '../../../redux/actions/EntitlementActions';
import { EntitlementState } from '../../../redux/reducers/EntitlementReducer';
import { UserEntitlement, EntitlementModule } from "../../../services/Entitlement";

import './EntitlementModal.scss'

const EntitlementModal = (props: any) => {
    const entitlementReducerState: EntitlementState = useSelector((state: any) => state.usersEntitlement);
    const dispatch = useDispatch();

    const [productCount, setProductCount] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState<Array<EntitlementModule>>([]);
    const [selectedTransactionType, setSelectedTransactionType] = useState<Array<EntitlementModule>>([]);

    const [transactionTypeCount, setTransactionTypeCount] = useState(0);
    const [userEntitlement, setUserEntitlement] = useState<UserEntitlement>();

    const [userRole, setUserRole] = useState('');
    const [userName, setUserName] = useState('');

    const [openDialog, setOpenDialog] = useState(false);

    const [userID, setUserID] = useState('');
    const [dailyLimit, setDailyLimit] = useState('');
    const [entitlementProducts, setEntitlementProducts] = useState<EntitlementModule[]>();
    const [entitlementTransType, setEntitlementTransType] = useState<EntitlementModule[]>();
    const [selectedSubProduct, setSelectedSubProduct] = useState<Array<EntitlementModule>>([]);
    const [currentTransType, setCurrentTransType] = useState<Array<Object>>([]);
    const [currentSubProduct, setCurrentSubProduct] = useState<Array<Object>>([]);

    const onTransactionTypeChange = (event: any) => {
        setProductCount(event.target.checked ? productCount + 1 : productCount - 1);

        const transTypeData = { id: event.target.id, name: event.target.name, checked: event.target.checked, parentId: event.target.productId }
        if (event.target.checked) {
            setSelectedTransactionType(prevState => ([transTypeData, ...prevState]));
        }
        else {
            setSelectedTransactionType(selectedTransactionType.filter((item: any) => item.id != event.target.id));
        }
    }

    const onProductChange = (event: any) => {
        const productData = { id: event.target.id, name: event.target.name, checked: event.target.checked, parentId: 0 }
        if (event.target.checked) {
            setSelectedProduct(prevState => ([productData, ...prevState]));
        }
        else {
            setSelectedProduct(selectedProduct.filter((item: any) => item.id != event.target.id));
        }
    }

    useEffect(() => {
        
        if (selectedProduct && selectedProduct.length > 0) {
            setCurrentTransType(selectedTransactionType.filter((transType: any) => transType.parentId == selectedProduct[0].id));
        }

    }, [selectedProduct]);

    useEffect(() => {
        if (selectedTransactionType && selectedTransactionType.length > 0) {
            setCurrentSubProduct(selectedSubProduct.filter((subProduct: any) => subProduct.parentId == selectedTransactionType[0].id && selectedTransactionType[0].parentId == selectedProduct[0].id));
        }

        console.log(selectedTransactionType);
    }, [selectedTransactionType]);

    const onSubProductChange = (event: any) => {
        setTransactionTypeCount(event.target.checked ? transactionTypeCount + 1 : transactionTypeCount - 1);

        const subProductData = { id: event.target.id, name: event.target.name, checked: event.target.checked, parentId: event.target.parentId }
        if (event.target.checked) {
            setSelectedSubProduct(prevState => ([subProductData, ...prevState]));
        }
        else {
            setSelectedSubProduct(selectedSubProduct.filter((item: any) => item.id != event.target.id));
        }

    }

    const onCloseModal = () => {
        setProductCount(0);
        setTransactionTypeCount(0);
        setSelectedProduct([]);
        setSelectedTransactionType([]);
        props.setOpen(false);
    }

    const onUserIdChange = (event: any) => {
        setUserID(event.target.textContent);
        fetchEntitlementForUser(event.target.textContent);
    }

    const onUserNameChange = (event: any) => {
        setUserName(event.target.value);
    }

    const fetchEntitlementForUser = async (selectedUser: string) => {
        dispatch({ type: GET_USER_ENTITLEMENT, payload: { userId: selectedUser } });
    }
    useEffect(() => {
        if (entitlementReducerState && !entitlementReducerState.error && entitlementReducerState.data) {
            let data = entitlementReducerState.data;
            setUserEntitlement(data);
            setUserRole(data.role);
            setUserName(data.userName);
            setEntitlementProducts(data.products);
            setDailyLimit(data.dailyLimit);
            setEntitlementTransType(data.transType);
            setSelectedProduct(data.products);
            setSelectedTransactionType(data.transType);
            setSelectedSubProduct(data.subProduct);
        }
    }, [entitlementReducerState]);

    const listOfRoles = ['Maker', 'Authorizer', 'Admin']

    const onRoleChange = (event: any) => {
        setUserRole(event.target.value)
        console.log(event.target.value);
    }

    const onSaveBtnClick = () => {
        setOpenDialog(true);
    }

    const onSaveConfirmation = () => {
        saveEntitlementData();
    }

    const saveEntitlementData = async () => {
        let result = await fetch("http://localhost:8080/leap/entitlement/add-entitlement", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID: userID, role: userRole, userName: userName, dailyLimit: dailyLimit, //transactionLimit: transactionLimit, 
                // products: JSON.stringify(selectedProduct),
                // transType: JSON.stringify(selectedTransactionType),
                // subProduct: JSON.stringify(selectedSubProduct)
                products: selectedProduct,
                transType: selectedTransactionType,
                subProduct: selectedSubProduct
             })
        })

        let response = await result.json();
        setOpenDialog(false);
        props.setOpen(false);
    }

    const onDailyLimitChange = (event: any) => {
        setDailyLimit(event.target.value);
    }

    return (
        <Modal open={props.open} className='modal'>
            <Card className='modal-body'>
                <Flex direction={'row'}>
                    <Text variant='h3' className='modal-header'>Add New Entitlement</Text>
                    <IconButton onClick={onCloseModal} sx={{
                        position: 'absolute',
                        right: 1
                    }}>

                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.5 3.5L3.5 20.5M3.5 3.5L20.5 20.5" stroke="#182F7C" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </IconButton>
                </Flex>
                <Flex direction="row" spacing={2} sx={{ marginBottom: '2rem' }}>
                    <Flex direction="column">
                        <Text className='label'>User ID</Text>
                        <Autocomplete
                            disablePortal
                            id="userId"
                            value={userEntitlement ? userEntitlement.userId : ""}
                            options={props.usersData}
                            sx={{ width: 300 }}
                            size='small'
                            renderInput={(params: any) => <TextField {...params} />}
                            getOptionLabel={(user: any) => user.userId}
                            onChange={onUserIdChange}
                        />
                    </Flex>
                    <Flex direction="column">
                        <Text className='label'>User Name</Text>
                        <Input className='ml-3 username-input' value={userName || ''} onChange={onUserNameChange} disabled={true} ></Input>
                    </Flex>
                    <Flex direction="column">
                        <Text className='label'>Role</Text>
                        <Select onChange={onRoleChange} value={userRole || ''} className='role-input'>
                            {listOfRoles.map((role, index) => {
                                return <MenuItem key={index} value={role}>{role}</MenuItem>;
                            })}
                        </Select>
                    </Flex>
                </Flex>
                <Flex sx={{ marginBottom: "20px" }}>
                    <Card style={{ padding: "30px", background: "#CFDEFF", width: "52rem", maxHeight: "9rem", overflow: 'auto' }}>
                        {userEntitlement && userEntitlement.userId && <>
                            <Flex direction='row'>
                                <Text className='product-title'>Product</Text>
                                <Text className='transaction-type-title'>Transaction Type</Text>
                                <Text className='sub-product-title'>Sub Product</Text>
                            </Flex>
                            <Card sx={{ padding: "10px", borderRadius: "0px" }}>
                                <Flex direction='row'>
                                    <Box className="product-list">
                                        <Flex>
                                            <FormGroup>
                                                {userEntitlement?.products?.map((item) => {
                                                    console.log(item.id);
                                                    return (<Flex direction="row">
                                                        <FormControlLabel control={<Checkbox id={item ? item.id.toString(): ''} key={item.id} name={item.name} onChange={onProductChange} checked={selectedProduct.find((obj: any) => obj.id == item.id) ? true : false} />} label={item.name} />
                                                        {/* {productCount > 0 && (Number(item.id) == selectedProduct) && <Text className='selection-count'>{productCount}</Text>} */}
                                                    </Flex>)
                                                })}
                                            </FormGroup>
                                        </Flex>
                                    </Box>
                                    <Box className='transaction-type-list'>
                                        <Flex>
                                            <FormGroup>
                                                {selectedProduct.length > 0 && currentTransType.map((item: any) => {

                                                    return (<Flex direction="row">
                                                        <FormControlLabel control={<Checkbox name={item.name} id={item ? item.id.toString(): ''} onChange={onTransactionTypeChange} checked={item.checked} />} label={item.name} />
                                                        {/* {transactionTypeCount > 0 && (Number(data.id) == selectedTransactionType) && <Text className='selection-count'>{transactionTypeCount}</Text>} */}
                                                    </Flex>)
                                                })}
                                            </FormGroup>
                                        </Flex>
                                    </Box>
                                    <Box className='sub-product-list'>
                                        <Flex>
                                            <FormGroup>
                                                {selectedTransactionType.length > 0 && currentSubProduct.map((item: any) => {
                                                    return (<Flex direction="row">
                                                    <FormControlLabel control={<Checkbox name={item.name} id={item ? item.id.toString(): ''} onChange={onSubProductChange} checked={item.checked} />} label={item.name} />
                                                    {/* {transactionTypeCount > 0 && (Number(data.id) == selectedTransactionType) && <Text className='selection-count'>{transactionTypeCount}</Text>} */}
                                                </Flex>)
                                                })}
                                            </FormGroup>
                                        </Flex>
                                    </Box>
                                </Flex>
                            </Card>
                        </>}
                    </Card>
                </Flex>

                {userEntitlement && userEntitlement.role == 'Maker' && <Flex>
                    <Text className='label'>Daily Limit</Text>
                    <Input className='username-input' value={dailyLimit} onChange={onDailyLimitChange}></Input>
                </Flex>}

                {userEntitlement && userEntitlement.role == 'Authorizer' && <Flex>
                    <Text className='label'>Transaction Limit</Text>
                    <Input className='username-input' value={userEntitlement ? userEntitlement.transactionLimit : ''}></Input>
                </Flex>}
                <Flex direction='row' gap={1} sx={{
                    width: 1,
                    justifyContent: 'end'
                }} justifyContent="space-between">
                    <Button color='primary' onClick={onSaveBtnClick} type='submit'>
                        Save
                    </Button>
                    <Button color='secondary' onClick={onCloseModal}>
                        Cancel
                    </Button>
                </Flex>
                <Dialog open={openDialog}>
                    <Card elevation={3} sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <Text variant='h5'>Modify Entitlement</Text>

                        <Text variant='label1'>
                            {`Are you confirm to modify data for user ${userID}?`}
                        </Text>

                        <Flex direction='row' gap={1} sx={{
                            width: 1
                        }} justifyContent="space-between">
                            <Button fullWidth color='primary' onClick={onSaveConfirmation}>
                                Confirm
                            </Button>
                            <Button fullWidth color='secondary' onClick={() => setOpenDialog(false)}>
                                Cancel
                            </Button>
                        </Flex>
                    </Card>
                </Dialog>
            </Card>
        </Modal>
    )
}

export default EntitlementModal






const onCloseModal = () => {
    setProductCount(0);
    setTransactionTypeCount(0);
    setSelectedProduct([]);
    setSelectedTransactionType([]);
    setUserEntitlement(undefined);
    setUserRole('');
    setUserName('');
    setUserID('');
    setDailyLimit('');
    setEntitlementProducts([]);
    setEntitlementTransType([]);
    setSelectedSubProduct([]);
    setCurrentTransType([]);
    setCurrentSubProduct([]);
    props.setOpen(false);
};


useEffect(() => {
    if (!props.open) {
        // Reset state when modal is closed
        setProductCount(0);
        setTransactionTypeCount(0);
        setSelectedProduct([]);
        setSelectedTransactionType([]);
        setUserEntitlement(undefined);
        setUserRole('');
        setUserName('');
        setUserID('');
        setDailyLimit('');
        setEntitlementProducts([]);
        setEntitlementTransType([]);
        setSelectedSubProduct([]);
        setCurrentTransType([]);
        setCurrentSubProduct([]);
    }
}, [props.open]);

