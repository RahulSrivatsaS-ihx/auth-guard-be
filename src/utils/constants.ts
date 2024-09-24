export const QUERY_CONSTANTS = {
  ENTIT_PROPERTY_COLUMNS: [
      'Entity_Property.EP_ID', 
      'Entity_Property.EP_E_ID', 
      'Entity_Property.EP_PropertyName', 
      'Entity_Property.EP_PropertyValue', 
      'Entity_Property.EP_ISACTIVE', 
      'Entity_Property.EP_ADDUSER', 
      'Entity_Property.EP_CREATEDON', 
      'Entity_Property.EP_MODIFIEDUSER', 
      'Entity_Property.EP_MODIFIEDON', 
      'Entity_Property.EP_GroupId', 
      'Entity_Property.EP_LookUpId', 
      'Entity_Property.ProductCode'
  ],
  TBL_APPLICATION_USER_COLUMNS: [
      'TblApplicationUser.TAU_Id', 
      'TblApplicationUser.TAU_MBId', 
      'TblApplicationUser.TAU_FirstName', 
      'TblApplicationUser.TAU_LastName', 
      'TblApplicationUser.TAU_MiddleName', 
      'TblApplicationUser.TAU_LoginName', 
      // 'TblApplicationUser.TAU_Password', 
      'TblApplicationUser.TAU_ProviderMasterEntityId', 
      'TblApplicationUser.TAU_EmailId', 
      'TblApplicationUser.TAU_AltEmailId', 
      'TblApplicationUser.TAU_PhoneNumber', 
      'TblApplicationUser.TAU_AltPhoneNumber', 
      'TblApplicationUser.TAU_IsActive', 
      'TblApplicationUser.TAU_IsLocked', 
      'TblApplicationUser.TAU_FailedAttemptCount', 
      'TblApplicationUser.TAU_Createdby', 
      'TblApplicationUser.TAU_CreatedOn', 
      // 'TblApplicationUser.TAU_Password1', 
      'TblApplicationUser.Modifiedon', 
      'TblApplicationUser.TAU_HasLoggedIn', 
      'TblApplicationUser.TAU_AccountLockedOn', 
      'TblApplicationUser.TAU_ModifiedBy', 
      'TblApplicationUser.TAU_IsMobileVerified', 
      'TblApplicationUser.TAU_IsEmailVerified', 
      'TblApplicationUser.TAU_MobileVerifiedModifiedOn', 
      'TblApplicationUser.TAU_EmailVerifiedModifiedOn'
  ],
  ENTIT_TBL_COLUMNS: [
    'EntityTbl_Entity.E_Id',
    'EntityTbl_Entity.E_ParentId',
    'EntityTbl_Entity.E_EntityType',
    'EntityTbl_Entity.E_Hierarchy_Group',
    'EntityTbl_Entity.E_Hierarchy_Sub_Group',
    'EntityTbl_Entity.E_FullName',
    'EntityTbl_Entity.E_DisplayName',
    'EntityTbl_Entity.E_PrimaryAddress',
    'EntityTbl_Entity.E_Landmark',
    'EntityTbl_Entity.E_PinCode',
    'EntityTbl_Entity.E_CountryId',
    'EntityTbl_Entity.E_StateId',
    'EntityTbl_Entity.E_CityId',
    'EntityTbl_Entity.E_DistrictId',
    'EntityTbl_Entity.E_LocationId',
    'EntityTbl_Entity.E_LandlineNumber',
    'EntityTbl_Entity.E_FaxNumber',
    'EntityTbl_Entity.E_MobileNumber',
    'EntityTbl_Entity.E_EmailAddress',
    'EntityTbl_Entity.E_ContactName',
    'EntityTbl_Entity.E_ContactNumber',
    'EntityTbl_Entity.E_ContactEmail',
    'EntityTbl_Entity.E_TollFreeNo',
    'EntityTbl_Entity.E_Website',
    'EntityTbl_Entity.E_Latitude',
    'EntityTbl_Entity.E_Longitude',
    'EntityTbl_Entity.E_LatLongVerified',
    'EntityTbl_Entity.E_GSTINNumber',
    'EntityTbl_Entity.E_PanNumber',
    'EntityTbl_Entity.E_PanHolderName',
    'EntityTbl_Entity.E_PanStatus',
    'EntityTbl_Entity.E_PanRemarks',
    'EntityTbl_Entity.E_Rating',
    'EntityTbl_Entity.E_ISACTIVE',
    'EntityTbl_Entity.E_ADDUSER',
    'EntityTbl_Entity.E_CREATEDON',
    'EntityTbl_Entity.E_MODIFIEDUSER',
    // 'EntityTbl_Entity.E_MODIFIEDON',
    // 'EntityTbl_Entity.E_PrevEntityId'
  ]

};


export const payerHospitalIdMap = {
  'hs': '516571',
  'digit': '516572',
  'ejic': '516574',
  'default_value': '516573'
};

export const getPayerId = (payerHospitalId:any) => {
  const key = payerHospitalId.startsWith('hs') ? 'hs' :
              /^\d/.test(payerHospitalId) ? 'digit' :
              /^ejic/i.test(payerHospitalId) ? 'ejic' :
              'default';

  return payerHospitalIdMap[key] || 'default_value'; // Handle unmatched cases
};