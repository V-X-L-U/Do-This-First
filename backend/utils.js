const runTxWithResults = async (session, closure) => {
  let result;
  try {
    await session.withTransaction(() => {
      result = closure();
      // need to return a promise
      // See Node.js driver documentation for `withTransaction`
      return result;
    });
  } catch (txErr) {
    console.log(txErr);
  }
  return result;
};

module.exports = { runTxWithResults };
