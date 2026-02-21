class InvestmentDTO {
  constructor(investment) {
    const obj = investment;
    this.id = obj._id || obj.id;
    this.userId = obj.userId || obj.user;
    this.amount = obj.amount;
    this.monthlyAmount = obj.monthlyAmount;
    this.months = obj.months;
    this.maturityAmount = obj.maturityAmount;
    this.maturityDate = obj.maturityDate;
    this.type = obj.type;
    this.createdAt = obj.createdAt;
  }
}

module.exports = InvestmentDTO;
