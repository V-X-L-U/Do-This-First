class TxError extends Error {
  constructor(cause) {
    super(`Abort transaction: ${cause}`);

    this.name = "TxError";
  }
}

module.exports = TxError;
