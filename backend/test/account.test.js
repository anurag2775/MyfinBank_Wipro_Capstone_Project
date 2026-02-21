const request = require("supertest");
const app = require("../index");
const { expect } = require("chai");

let token;

describe("Account Service Tests", () => {

  before(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "unittest12@gmail.com",
        password: "123456"
      });

    token = res.body.token;
  });

  it("should deposit amount", async () => {
    const res = await request(app)
      .post("/api/account/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 1000 });

    expect(res.status).to.equal(200);
    expect(res.body.balance).to.be.a("number");
  });

  it("should withdraw amount", async () => {
    const res = await request(app)
      .post("/api/account/withdraw")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 500 });

    expect(res.status).to.equal(200);
  });

});
