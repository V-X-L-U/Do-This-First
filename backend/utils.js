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

module.exports = { runTxWithResults };
