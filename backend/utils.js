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
    if (!mongoose.ObjectId.isValid(iDList[i])) {
      return false;
    }
  }

  return true;
};

module.exports = { runTxWithResults, checkValidObjectIds };
