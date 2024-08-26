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
  public constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  public async findAll(): Promise<{ data: EntitlementUserMaster[] }> {
    this.log.info('START::API::EntitlementService::find all: Entitlement data', {});
    const response = await this.dataSource
      .getMongoRepository(EntitlementUserMaster)
      .find({ $and: [{ role: { $ne: 'Administrator' } }, { isDeleted: { $eq: false } }] });

    return { data: response };
  }

  public async addEntitlement(
    addEntitlementRequest: IAddEntitlement
  ): Promise<IAddEntitlement> {
    this.log.info('START::API::EntitlementService:: add Entitlement: ADD', {
      body: addEntitlementRequest,
    });

    if (!addEntitlementRequest?.userId) {
      this.log.error('ERROR::API::EntitlementService:: Add Entitlement: Invalid user Id', {
        error: new CSError(400, 'Invalid request'),
      });

      throw new CSError(400, 'Invalid request', 'Invalid user Id', MESSAGE_CONSTANTS.INVALID_USER_ID);
    }

    const entitlementMaster = await this.dataSource
      .getMongoRepository(EntitlementMaster)
      .find({ where: { userId: addEntitlementRequest?.userId } });

    if (entitlementMaster.length === 0) {
      const response = await this.dataSource
        .getMongoRepository(EntitlementUserMaster)
        .find({ where: { userId: addEntitlementRequest?.userId } });

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
    const updateUserMasterObject = {
      username: updateEntitlementRequest.userName,
      role: updateEntitlementRequest.role,
      isDeleted: false,
    };
    const formatUserMasterUpdateObject = { $set: updateUserMasterObject };

    // Updating User Master Table with updated username and role.
    await this.dataSource
      .getMongoRepository(EntitlementUserMaster)
      .findOneAndUpdate(updateUserMasterQuery, formatUserMasterUpdateObject, { upsert: true });

    const updateQuery = { userId: updateEntitlementRequest.userId };
    const updateObject = { ...updateEntitlementRequest, isDeleted: false };
    const formatUpdateObject = { $set: updateObject };

    return this.dataSource
      .getMongoRepository(EntitlementAddData)
      .findOneAndUpdate(updateQuery, formatUpdateObject, { upsert: true });
  }

  public async searchUserData(
    searchEntitlementRequest: ISearchEntitlement
  ): Promise<ISearchEntitlement> {
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
      response = await this.dataSource
        .getRepository(EntitlementUserMaster)
        .find({ where: obj });
    } else {
      response = await this.dataSource.getRepository(EntitlementUserMaster).find();
    }

    return response;
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
    const entitlementUserId = await this.dataSource
      .getRepository(EntitlementMaster)
      .find({ where: { userId: userRequestData.userId } });
    const userData = await this.dataSource
      .getMongoRepository(EntitlementUserMaster)
      .find({ where: { userId: userRequestData.userId } });

    if (entitlementUserId.length === 0) {
      const productData = await this.dataSource
        .getMongoRepository(EntitlementProductMaster)
        .find();
      const transactionTypeData = await this.dataSource
        .getMongoRepository(EntitlementTransactionTypeMaster)
        .find();
      const subProductData = await this.dataSource
        .getMongoRepository(EntitlementSubProductMaster)
        .find();
      responseData = Object.assign(responseData, {
        userId: userData[0].userId,
        userName: userData[0].username,
        role: userData[0].role,
      });
      limitData = Object.assign(limitData, { dailyLimit: undefined, transactionLimit: undefined });

      data.products = productData;
      data.transType = transactionTypeData;
      data.subProduct = subProductData;
      data = Object.assign(responseData, data, limitData);
      subProductMaster.data.push(data);
      const output = await transformProductData(data);
      return [output];
    } else {
      const response = await this.dataSource
        .getMongoRepository(EntitlementAddData)
        .find({ where: { userId: userRequestData.userId, isDeleted: false } });
      response[0].userName = userData[0].username;
      response[0].role = userData[0].role;
      return response;
    }
  }

  public async deleteEntitlement(
    entitlementUserRequest: IGetProductEntitlement
  ): Promise<any> {
    this.log.info('START::API::EntitlementService::delete row/rows: delete', {
      body: entitlementUserRequest,
    });

    if (!entitlementUserRequest?.userId) {
      this.log.error('ERROR::API::EntitlementService:: Delete: Invalid request', {
        error: new CSError(400, 'Invalid request'),
      });

      throw new CSError(400, 'Invalid request', 'Invalid userId', MESSAGE_CONSTANTS.INVALID_USER_ID);
    }

    const entitlementMaster = await this.dataSource
      .getMongoRepository(EntitlementMaster)
      .find({ where: { userId: entitlementUserRequest.userId } });

    if (entitlementMaster.length > 0) {
      const query = { userId: entitlementUserRequest.userId };
      const updateObject = { $set: { isDeleted: true } };

      await this.dataSource
        .getMongoRepository(EntitlementAddData)
        .findOneAndUpdate(query, updateObject, { upsert: false });

      const message = { message: MESSAGE_CONSTANTS.DATA_DELETED_SUCCESSFULLY };
      return message;
    } else {
      this.log.info('INFO::API::EntitlementService:: Delete: No record found', {
        message: MESSAGE_CONSTANTS.NO_RECORD_FOUND,
      });
      throw new CSError(400, MESSAGE_CONSTANTS.NO_RECORD_FOUND);
    }
  }
}
