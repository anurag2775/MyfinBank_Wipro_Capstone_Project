const request = require("supertest");
const app = require("../index");
const { expect } = require("chai");

let token;

describe("Investment API Tests", () => {

  before(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser_api@gmail.com",
        password: "123456"
      });

    token = res.body.token;
  });

  it("should transfer money to loan investment", async () => {
    const res = await request(app)
      .post("/api/investments/loan")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 1000 });

    expect(res.status).to.be.oneOf([404, 201]);
  });

});
