const request = require("supertest");
const app = require("../index");
const { expect } = require("chai");

describe("Auth Service Tests", () => {

  it("should register a user or handle duplicate email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "unittest12@gmail.com",
        password: "123456"
      });

    expect(res.status).to.be.oneOf([201, 400]);

    if (res.status === 201) {
      expect(res.body.message.toLowerCase()).to.include("registered");
    }

    if (res.status === 400) {
      expect(res.body.message).to.include("Email already exists");
    }
  });

  it("should login user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "unittest12@gmail.com",
        password: "123456"
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
  });

});

