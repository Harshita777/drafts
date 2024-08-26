import { Service } from 'typedi';
import { CSError, Log as Logger, LoggerInterface } from '@enbdleap/node-core';
import { InjectDataSource, DataSource } from '@enbdleap/node-db';
import { EntitlementMaster } from '../../models/entitlement/EntitlementMaster';
import { EntitlementAddData } from '../../models/entitlement/EntitlementAddData';
import { EntitlementUserMaster } from '../../models/entitlement/EntitlementUserMaster';
import { EntitlementProductMaster } from '../../models/entitlement/EntitlementProductMaster';
import { EntitlementTransactionTypeMaster } from '../../models/entitlement/EntitlementTransactionTypeMaster';
import { EntitlementSubProductMaster } from '../../models/entitlement/EntitlementSubProductMaster';
import { IAddEntitlement } from 'src/interface/request/IAddEntitlement.interface';
import { ISearchEntitlement } from 'src/interface/request/ISearchEntitlement.interface';
import { IGetProductEntitlement } from 'src/interface/request/IGetProductEntitlement.interface';
import { MESSAGE_CONSTANTS } from '../../../constants/MessageConstants';
import { transformProductData } from '../../../utils/helpers';

@Service()
export class EntitlementService {
	public constructor(@InjectDataSource() private dataSource: DataSource, @Logger(__filename) private log: LoggerInterface) {}
	public async findAll(): Promise<{ data: EntitlementUserMaster[] }> {
		this.log.info('START::API::EntitlementService::find all: Entitlement data', {});
		const response = await this.dataSource.getMongoRepository(EntitlementUserMaster).find({ $and: [{ role: { $ne: 'Administrator' } }, { isDeleted: { $eq: false } }] });

		return Promise.resolve({ data: response });
	}

	public async addEntitlement(addEntitlementRequest: IAddEntitlement): Promise<IAddEntitlement> {
		this.log.info('START::API::EntitlementService:: add Entitlement: ADD', {
			body: addEntitlementRequest,
		});

		if (!addEntitlementRequest?.userId) {
			this.log.error('ERROR::API::EntitlementService:: Add Entitlement: Invalid user Id', {
				error: new CSError(400, 'Invalid request'),
			});

			throw new CSError(400, 'Invalid request', 'Invalid user Id', MESSAGE_CONSTANTS.INVALID_USER_ID);
		}

		const entitlementMaster = await this.dataSource.getMongoRepository(EntitlementMaster).find({ where: { userId: addEntitlementRequest?.userId } });
		if (entitlementMaster.length === 0) {
			const response = await this.dataSource.getMongoRepository(EntitlementUserMaster).find({ where: { userId: addEntitlementRequest?.userId } });
			const userDetails = {
				cif: response[0]?.cif,
				subscriptionID: response[0]?.subscriptionId,
				emailID: response[0]?.email,
				phoneNumber: response[0]?.phone,
				idNumber: response[0]?.idNumber,
				idProofType: response[0]?.idProofType,
				expiryDate: response[0]?.expiryDate,
			};
			const updateObject = { ...userDetails, ...addEntitlementRequest, isDeleted: false };
			return this.dataSource.getMongoRepository(EntitlementAddData).save(updateObject);
		} else {
			return this.updateEntitlement(addEntitlementRequest);
		}
	}

	public async updateEntitlement(updateEntitlementRequest: any): Promise<any> {
		this.log.info('START::API::EntitlementService::update: update entitlement', {
			body: updateEntitlementRequest,
		});

		if (!updateEntitlementRequest?.userId) {
			this.log.error('ERROR::API::EntitlementService:: Update Entitlement: Invalid user Id', {
				error: new CSError(400, 'Invalid request', MESSAGE_CONSTANTS.INVALID_USER_ID),
			});

			throw new CSError(400, 'Invalid request', 'Invalid user Id');
		}

		const updateUserMasterQuery = { userId: updateEntitlementRequest.userId };
		const updateUserMasterObject = { username: updateEntitlementRequest.userName, role: updateEntitlementRequest.role, isDeleted: false };
		const formatUserMasterUpdateObject = { $set: updateUserMasterObject };

		// Updating User Master Table with updated username and role.
		this.dataSource.getMongoRepository(EntitlementUserMaster).findOneAndUpdate(updateUserMasterQuery, formatUserMasterUpdateObject, { upsert: true });

		const updateQuery = { userId: updateEntitlementRequest.userId };
		const updateObject = { ...updateEntitlementRequest, isDeleted: false };
		const formatUpdateObject = { $set: updateObject };
		return this.dataSource.getMongoRepository(EntitlementAddData).findOneAndUpdate(updateQuery, formatUpdateObject, { upsert: true });
	}

	public async searchUserData(searchEntitlementRequest: ISearchEntitlement): Promise<ISearchEntitlement> {
		this.log.info('START::API::EntitlementService::search user data: Search', {
			body: searchEntitlementRequest,
		});

		let obj: any = {};
		let response;
		if (searchEntitlementRequest.userId) {
			obj = Object.assign(obj, { userId: searchEntitlementRequest.userId });
		}
		if (searchEntitlementRequest.userName) {
			obj = Object.assign(obj, { username: new RegExp(searchEntitlementRequest.userName, 'i') });
		}
		if (searchEntitlementRequest.userId || searchEntitlementRequest.userName) {
			response = await this.dataSource.getRepository(EntitlementUserMaster).find({ where: obj });
		} else {
			response = await this.dataSource.getRepository(EntitlementUserMaster).find();
		}

		return Promise.resolve(response);
	}

	public async searcEntitlementCongifData(userRequestData: any): Promise<any> {
		this.log.info('START::API::EntitlementService::get product: product', {
			body: userRequestData,
		});

		if (!userRequestData?.userId) {
			this.log.error('ERROR::API::EntitlementService:: Get product Entitlement: Invalid userId', {
				error: new CSError(400, 'Invalid request'),
			});

			throw new CSError(400, 'Invalid request', 'Invalid userId', MESSAGE_CONSTANTS.INVALID_USER_ID);
		}

		let data: any = { products: [], transType: [], subProduct: [] };
		const subProductMaster: any = { data: [] };

		let responseData: any = {};
		let limitData: any = {};
		const entitlementUserId = await this.dataSource.getRepository(EntitlementMaster).find({ where: { userId: userRequestData.userId } });
		const userData = await this.dataSource.getMongoRepository(EntitlementUserMaster).find({ where: { userId: userRequestData.userId } });
		if (entitlementUserId.length === 0) {
			const productData = await this.dataSource.getMongoRepository(EntitlementProductMaster).find();
			const transactionTypeData = await this.dataSource.getMongoRepository(EntitlementTransactionTypeMaster).find();
			const subProductData = await this.dataSource.getMongoRepository(EntitlementSubProductMaster).find();
			responseData = Object.assign(responseData, { userId: userData[0].userId, userName: userData[0].username, role: userData[0].role });
			limitData = Object.assign(limitData, { dailyLimit: null, transactionLimit: null });

			data.products = productData;
			data.transType = transactionTypeData;
			data.subProduct = subProductData;
			data = Object.assign(responseData, data, limitData);
			subProductMaster.data.push(data);
			const output = await transformProductData(data);
			return Promise.resolve([output]);
		} else {
			const response = await this.dataSource.getMongoRepository(EntitlementAddData).find({ where: { userId: userRequestData.userId, isDeleted: false } });
			response[0].userName = userData[0].username;
			response[0].role = userData[0].role;
			return Promise.resolve(response);
		}
	}

	public async deleteEntitlement(entitlementUserRequest: IGetProductEntitlement): Promise<any> {
		this.log.info('START::API::EntitlementService::delete row/rows: delete', {
			body: entitlementUserRequest,
		});

		if (!entitlementUserRequest?.userId) {
			this.log.error('ERROR::API::EntitlementService:: delete Entitlement: Invalid userId', {
				error: new CSError(400, 'Invalid request'),
			});

			throw new CSError(400, 'Invalid request', 'Invalid userId', MESSAGE_CONSTANTS.INVALID_USER_ID);
		}
		let updateQuery: any = {};
		updateQuery = { userId: entitlementUserRequest.userId };
		const updateObject = { isDeleted: true };
		const formatUpdateObject = { $set: updateObject };
		const response = this.dataSource.getMongoRepository(EntitlementUserMaster).findOneAndUpdate(updateQuery, formatUpdateObject, { upsert: true });
		return Promise.resolve(response);
	}

	public async getUser(): Promise<any> {
		const response = await this.dataSource.getMongoRepository(EntitlementUserMaster).find();
		return response;
	}

	/** API is used for displaying Nested data in View Option for User Master Table */

	public async getUserEntitlement(userRequestData): Promise<any> {
		const response: any = await this.dataSource.getMongoRepository(EntitlementAddData).find({ where: { userId: userRequestData.userId, isDeleted: false } });
		let entitlementObj: any = { userId: '', username: '', role: '', dailyLimit: '' };

		const entitlementArr = [];
		let count = 1;
		function findCheckedModules(array) {
			for (const item of array) {
				if (item.parentId === 0 && item.checked) {
					entitlementObj.product = item.name;
				}

				for (const transType of item.transType) {
					if (transType.checked && item.id === transType.parentId) {
						if (!entitlementObj.id) {
							entitlementObj.product = item.name;
						}
						entitlementObj.transaction_type = transType.name;

						for (const subProduct of transType.subProduct) {
							if (subProduct.checked && transType.id === subProduct.parentId) {
								entitlementObj.subProduct = subProduct.name;
								entitlementArr.push(entitlementObj);
								entitlementObj = { userId: '', username: '', role: '', dailyLimit: '', product: item.name, transaction_type: transType.name };
							}
						}
					}
				}
				count++;
			}
			return entitlementArr;
		}
		const result = findCheckedModules(response[0].products);

		const responseData: any = {};
		responseData.userId = response[0].userId;
		responseData.userName = response[0].userName;
		responseData.role = response[0].role;
		responseData.product = result.length + ' Products';
		responseData.transaction_type = result.length + ' Transaction Types';
		responseData.subProduct = result.length + ' Sub Products';
		responseData.dailyLimit = response[0].dailyLimit;
		responseData.transactionLimit = response[0].transactionLimit;
		responseData.child = result;
		return [responseData];
	}

	public async getDailyLimit(entRequest: any): Promise<any> {
		this.log.info('START::API::EntitlementService::validate: Authenticating user', {
			body: entRequest,
		});

		if (!entRequest.subscriptionId) {
			this.log.trace('ERROR::API::EntitlementService::validate: Invalid subscriptionId', {
				body: entRequest,
			});
			throw new CSError(400, 'Invalid request', MESSAGE_CONSTANTS.INVALID_SUBSCRIPTION_ID);
		}

		if (!entRequest.userId) {
			this.log.trace('ERROR::API::EntitlementService::validate: Invalid userId', {
				body: entRequest,
			});
			throw new CSError(400, 'Invalid request', MESSAGE_CONSTANTS.INVALID_USER_ID);
		}

		const findQuery = { userId: entRequest.userId, subscriptionID: entRequest.subscriptionId };
		const dailyLimit = await this.dataSource.getMongoRepository(EntitlementMaster).findOne({ where: findQuery });

		if (!dailyLimit) {
			this.log.trace('ERROR::API::EntitlementService::validate: Invalid account', {
				body: dailyLimit,
			});
			throw new CSError(401, 'Unauthorized', MESSAGE_CONSTANTS.INVALID_ACCOUNT);
		}

		return {
			status: 'success',
			dailyLimit,
			errors: [],
		};
	}
}





C:\Users\HarshitaKU\Documents\HarshitaDevDrv\EnbdPOC\Bem\bem-auth\src\api\services\entitlement\EntitlementService.ts
   21:1   error    This line has a length of 173. Maximum allowed is 160                                
                                                                               max-len
   76:3   error    Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator  @typescript-eslint/no-floating-promises
  131:55  error    Use undefined instead of null                                                        
                                                                               no-null/no-null
  131:79  error    Use undefined instead of null                                                        
                                                                               no-null/no-null
  175:34  error    Argument 'userRequestData' should be typed                                           
                                                                               @typescript-eslint/explicit-module-boundary-types
  175:34  error    Expected userRequestData to have a type annotation                                   
                                                                               @typescript-eslint/typedef
  176:1   error    This line has a length of 161. Maximum allowed is 160                                
                                                                               max-len
  180:7   warning  'count' is assigned a value but never used                                           
                                                                               @typescript-eslint/no-unused-vars
  181:3   error    Missing return type on function                                                      
                                                                               @typescript-eslint/explicit-function-return-type
  181:3   error    Use const or class constructors instead of named functions                           
                                                                               prefer-arrow/prefer-arrow-functions
  181:31  error    Expected array to have a type annotation                                             
                                                                               @typescript-eslint/typedef


