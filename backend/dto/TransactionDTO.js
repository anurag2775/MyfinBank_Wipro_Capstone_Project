class TransactionDTO {
  constructor(txn) {
    this.id = txn._id;
    this.accountId = txn.accountId;
    this.type = txn.type;
    this.amount = txn.amount;
    this.transactionId = txn.transactionId;
    this.createdAt = txn.createdAt;
  }
}

module.exports = TransactionDTO;
