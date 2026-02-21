class AccountDTO {
  constructor(account) {
    if (!account) {
      throw new Error("Account is required");
    }

    try {
      // Handle both Mongoose documents and plain objects
      let accountObj;
      if (account.toObject && typeof account.toObject === 'function') {
        accountObj = account.toObject();
      } else {
        accountObj = account;
      }

      // Handle ObjectId conversion for user field
      const userId = accountObj.userId || accountObj.user;
      const userIdString = userId ? (userId.toString ? userId.toString() : userId) : null;

      this.id = accountObj._id ? (accountObj._id.toString ? accountObj._id.toString() : accountObj._id) : accountObj.id;
      this.userId = userIdString;
      this.accountId = accountObj.accountId || null;
      this.balance = accountObj.balance !== undefined && accountObj.balance !== null ? Number(accountObj.balance) : 0;
      this.type = accountObj.type || accountObj.accountType || null;
      this.isActive = accountObj.isActive !== undefined ? Boolean(accountObj.isActive) : true;
    } catch (error) {
      console.error("AccountDTO construction error:", error);
      console.error("Account data:", account);
      throw new Error(`Failed to create AccountDTO: ${error.message}`);
    }
  }
}

module.exports = AccountDTO;
