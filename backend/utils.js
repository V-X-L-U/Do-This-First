const ObjectId = require("mongoose").Types.ObjectId;

const runTxWithResults = async (session, closure) => {
  let result;
  await session.withTransaction(() => {
    result = closure();
    // need to return a promise
    // See Node.js driver documentation for `withTransaction`
    return result;
  });
  return result;
};

const checkValidObjectIds = (iDList) => {
  for (let i = 0; i < iDList.length; i++) {
    if (!ObjectId.isValid(iDList[i])) {
      return false;
    }
  }

  return true;
};

const produce500TxErr = (txRes, errMessage, location, err) => {
  txRes.status = 500;
  txRes.body = {
    message: errMessage,
    server_err: `[${location}] ${err.toString()}`,
  };
};

module.exports = { runTxWithResults, checkValidObjectIds, produce500TxErr };
