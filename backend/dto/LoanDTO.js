class LoanDTO {
  constructor(loan) {
    this.id = loan._id;
    this.amount = loan.amount;
    this.interestRate = loan.interestRate;
    this.months = loan.months;
    this.emi = loan.emi;
    this.status = loan.status;
  }
}

module.exports = LoanDTO;
