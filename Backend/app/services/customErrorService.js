    
 
  let ClientError = class ApplicationError extends Error{   // all error with 400
    constructor (errObj,status,data) {
    
      // Calling parent constructor of base Error class.
      super();
      
      // Saving class name in the property of our custom error as a shortcut.
      this.name = errObj.name;
      this.code = errObj.code;
      this.message = errObj.message;
      this.data = data || {};
  
      // Capturing stack trace, excluding constructor call from it.
      Error.captureStackTrace(this, this.constructor);
      
      // You can use any additional properties you want.
      // I'm going to use preferred HTTP status for this error types.
      // `500` is the default value if not specified.
      this.status = status || 400;
    }

 };

  let AppError = class ApplicationError extends Error{    //all error with 500.
    constructor (errObj,status,data) {
    
      // Calling parent constructor of base Error class.
      super();
      
      // Saving class name in the property of our custom error as a shortcut.
      this.name = errObj.name;
      this.code = errObj.code;
      this.message = errObj.message;
      this.data = data || {};
  
      // Capturing stack trace, excluding constructor call from it.
      Error.captureStackTrace(this, this.constructor);
      
      // You can use any additional properties you want.
      // I'm going to use preferred HTTP status for this error types.
      // `500` is the default value if not specified.
      this.status = status || 500;
    }
 };

 const ErrorName = {
  PARAMETER_VALIDATION_ERROR:"ParameterValidationError",
  AUTHTHENTICATION_ERROR:'AuthenticationError',
  AUTHORIZATION_ERROR:'AuthorizationError',
  CRITICAL_APPLICATION_ERROR:"CriticalApplicationError",
  END_OF_THE_WORLD_ERROR:"EndOfTheWorldError"
 }

const ErrorConstants = {

  ParameterValidationError : 
  {
    5001:{ name:ErrorName.PARAMETER_VALIDATION_ERROR,code:5001,message:'These parameter are strictly not allowed' },
    5002:{ name:ErrorName.PARAMETER_VALIDATION_ERROR,code:5002,message:'Parameter not supported by this request' },
    5003:{ name:ErrorName.PARAMETER_VALIDATION_ERROR,code:5003,message:'invalid no of parameter : check required no of parameter' },
    5004:{ name:ErrorName.PARAMETER_VALIDATION_ERROR,code:5004,message:'No body parameter provided' },
    5005:{name:ErrorName.PARAMETER_VALIDATION_ERROR,code:5005,message:'Invalid ObjectId'},
    5006:{name:ErrorName.PARAMETER_VALIDATION_ERROR,code:5006,message:'Invalid value provided : not present in referenced collection'}
  },
  AuthError:
  {
  1001:{name:ErrorName.AUTHTHENTICATION_ERROR,code:1001,message:'Failed to authenticate token : Token not provided or missing'},
  1002:{name:ErrorName.AUTHTHENTICATION_ERROR,code:1002,message:'Failed to authenticate token : Token Verification Failed'},
  1003:{name:ErrorName.AUTHTHENTICATION_ERROR,code:1003,message:'Failed to authenticate token : Payloads not Found'},
  1100:{name:ErrorName.AUTHORIZATION_ERROR,code:1100,message:'Consumer Not Authorised'}
  },
  CriticalApplicationError:
  {
    6001:{ name:ErrorName.CRITICAL_APPLICATION_ERROR,code:6001,message:'code should not have hit this it should no go here' }
  },
  EndOfTheWorldError:
  {
    7777:{ name:ErrorName.END_OF_THE_WORLD_ERROR,code:7000 ,message:'YOU ARE GONE !APPLICATION STOPPED WORKING' }
  }
} 


module.exports = { ClientError,AppError,ErrorConstants };