const request = require("supertest");
const app = require("../index");
const { expect } = require("chai");

let token;

describe("Loan Service Tests", () => {

  before(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "unittest12@gmail.com",
        password: "123456"
      });

    token = res.body.token;
  });

  it("should calculate EMI", async () => {
    const res = await request(app)
      .post("/api/loan/calculate-emi")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 100000,
        rate: 10,
        months: 12
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("emi");
  });

  it("should apply for loan", async () => {
    const res = await request(app)
      .post("/api/loan/apply")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 100000,
        rate: 10,
        months: 12,
        emi: 8792
      });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.include("Loan applied");
  });

});
