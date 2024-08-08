const request = require("supertest");
const app = require("../app");
const { hash } = require("../helpers/bcrypt");
const { sequelize } = require("../models");
const { signToken } = require("../helpers/jwt");

// let access_token;
beforeAll(async () => {
  const users = require("../data/user.json");
  users.forEach((el) => {
    el.password = hash(el.password);
    el.updatedAt = el.createdAt = new Date();
  });

  const products = require("../data/product.json");
  products.forEach((el) => {
    el.updatedAt = el.createdAt = new Date();
  });

  const category = require("../data/category.json");
  category.forEach((el) => {
    el.updatedAt = el.createdAt = new Date();
  });

  const payload = {
    email: "john.doe@example.com",
    password: "password",
    role: "Admin",
  };

  access_token = signToken(payload);

  await sequelize.queryInterface.bulkInsert("Categories", category, {});
  await sequelize.queryInterface.bulkInsert("Users", users, {});
  await sequelize.queryInterface.bulkInsert("Products", products, {});
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Categories", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await sequelize.queryInterface.bulkDelete("Products", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("POST /login", () => {
  describe("POST /login - success", () => {
    test("should login successfully with correct credentials", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ email: "john.doe@example.com", password: "password" });
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
    });
  });
  describe("POST /Login - Failed", () => {
    test("email not found", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ email: "", password: "password" });
        console.log(response);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message',"name or password required");
    });

    test("password not found", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ email: "john.doe@example.com", password: "" });
        console.log(response);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message',"name or password required");
    });

    test("email invalid", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ email: "admin1@example.com", password: "admin" });
        console.log(response);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message',"data not found");
    });

    test("password dont match", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ email: "admin@gmail.com", password: "adminulminul" });
        console.log(response);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message',"data not found");
    });
  });
});
