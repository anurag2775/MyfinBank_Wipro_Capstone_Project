const request = require("supertest");
const app = require("../index");
const { expect } = require("chai");

describe("End-to-End User Flow", () => {

  let token;

  it("registers user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "E2E User",
        email: "e2euser@gmail.com",
        password: "123456"
      });

    expect(res.status).to.be.oneOf([201, 400]);
  });

  it("logs in user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "e2euser@gmail.com",
        password: "123456"
      });

    token = res.body.token;
    expect(token).to.exist;
  });

  it("deposits money", async () => {
    const res = await request(app)
      .post("/api/account/deposit")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 2000 });

    expect(res.status).to.equal(200);
  });

  it("applies loan", async () => {
    const res = await request(app)
      .post("/api/loan/apply")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 50000,
        rate: 10,
        months: 12,
        emi: 4396
      });

    expect(res.status).to.equal(200);
  });

});
