const request = require("supertest");
const app = require("../app");
const { hash } = require("../helpers/bcrypt");
const { sequelize } = require("../models");
const { signToken } = require("../helpers/jwt");
let access_token;
let access_token_staff;
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

  const payloadAdmin = {
    email: "john.doe@example.com",
    password: "password",
    role: "Admin",
  };

  const payloadStaff = {
    email: "jane.smith@example.com",
    password: "password",
    role: "Staff",
  };

  access_token = signToken(payloadAdmin);
  access_token_staff = signToken(payloadStaff);

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

describe("POST /products", () => {
  describe("GET /products - succeed", () => {
    it("should be return of array of object instance data products", async () => {
      const response = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          name: "Baju",
          description: "baju cowok",
          price: 1222222,
          stock: 50,
          imgUrl:
            "https://m.media-amazon.com/images/I/41jyQ3SrbxL._AC_UY350_.jpg",
          categoryId: 1,
          authorId: 1,
        });
      // console.log(access_token);
      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Success Add Product");
      expect(response.body).toHaveProperty("product", expect.any(Object));
    });
  });

  describe("GET /products - fail", () => {
    it("login fail", async () => {
      const response = await request(app).post("/products").send({
        name: "Baju",
        description: "baju cowok",
        price: 1222222,
        stock: 50,
        imgUrl:
          "https://m.media-amazon.com/images/I/41jyQ3SrbxL._AC_UY350_.jpg",
        categoryId: 1,
        authorId: 1,
      });
      // console.log(access_token);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Please login first");
    });

    it("token invalid", async () => {
      const response = await request(app)
        .post("/products")
        .set("Authorization", `Bearer 127361293219`)
        .send({
          name: "Baju",
          description: "baju cowok",
          price: 1222222,
          stock: 50,
          imgUrl:
            "https://m.media-amazon.com/images/I/41jyQ3SrbxL._AC_UY350_.jpg",
          categoryId: 1,
          authorId: 1,
        });
      // console.log(access_token);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Please login first");
    });

    it("there's empty colomn", async () => {
      const response = await request(app)
        .post("/products")
        .set("Authorization", `Bearer 127361293219`)
        .send({
          name: "Baju",
          price: 1222222,
          stock: 50,
          imgUrl:
            "https://m.media-amazon.com/images/I/41jyQ3SrbxL._AC_UY350_.jpg",
          categoryId: 1,
          authorId: 1,
        });
      // console.log(access_token);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });
});

describe("PUT /products/:id", () => {
  describe("GET /products - succeed", () => {
    it("should be successfully update product by id", async () => {
      const response = await request(app)
        .put("/products/1")
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          name: "Baju cewek",
          description: "baju cewek",
          price: 1222222,
          stock: 1,
          imgUrl:
            "https://m.media-amazon.com/images/I/41jyQ3SrbxL._AC_UY350_.jpg",
          categoryId: 1,
          authorId: 1,
        });
      // console.log(access_token);
      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Success Update Product");
      expect(response.body).toHaveProperty("updated", expect.any(Object));
    });
  });

  describe("PUT /products - fail", () => {
    it("should be unsuccessfully update product by id because login fail", async () => {
      const response = await request(app).put("/products/1").send({
        name: "Baju cewek",
        description: "baju cewek",
        price: 1222222,
        stock: 1,
        imgUrl:
          "https://m.media-amazon.com/images/I/41jyQ3SrbxL._AC_UY350_.jpg",
        categoryId: 1,
        authorId: 1,
      });
      // console.log(access_token);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Please login first");
    });

    it("should be unsuccessfully update product by id because token invalid", async () => {
      const response = await request(app)
        .put("/products/1")
        .set("Authorization", `Bearer 1234`)
        .send({
          name: "Baju cewek",
          description: "baju cewek",
          price: 1222222,
          stock: 1,
          imgUrl:
            "https://m.media-amazon.com/images/I/41jyQ3SrbxL._AC_UY350_.jpg",
          categoryId: 1,
          authorId: 1,
        });
      // console.log(access_token);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Please login first");
    });

    it("should be unsuccessfully update product by id because id not match with database ", async () => {
      let id = 7;
      const response = await request(app)
        .put(`/products/${id}`)
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          name: "Baju cewek",
          description: "baju cewek",
          price: 1222222,
          stock: 1,
          imgUrl:
            "https://m.media-amazon.com/images/I/41jyQ3SrbxL._AC_UY350_.jpg",
          categoryId: 1,
          authorId: 1,
        });
      // console.log(access_token);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", `Data not found`);
    });

    it("should be unsuccessfully update product by id because staff updated who not belongs to them ", async () => {
      let id = 3;
      const response = await request(app)
        .put(`/products/${id}`)
        .set("Authorization", `Bearer ${access_token_staff}`)
        .send({
          name: "",
          description: "baju cewek",
          price: 1222222,
          stock: 1,
          imgUrl:
            "https://m.media-amazon.com/images/I/41jyQ3SrbxL._AC_UY350_.jpg",
          categoryId: 1,
          authorId: 1,
        });
      // console.log(access_token);
      expect(response.status).toBe(403);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });
});

describe("DELETE /products/:id", () => {
  describe("GET /products - succeed", () => {
    it("should be successfully delete product by id", async () => {
      let id = 1;
      const response = await request(app)
        .delete(`/products/${id}`)
        .set("Authorization", `Bearer ${access_token}`);
      // console.log(access_token);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        `Success delete Product with id ${id}`
      );
    });
  });

  describe("DELETE /products - fail", () => {
    it("should be unsuccessfully delete product by id because login invalid", async () => {
      let id = 1;
      const response = await request(app).delete(`/products/${id}`);
      // console.log(access_token);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Please login first");
    });

    it("should be unsuccessfully delete product by id because token invalid", async () => {
      let id = 1;
      const response = await request(app).delete(`/products/${id}`);
      // console.log(access_token);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Please login first");
    });

    it("should be unsuccessfully delete product by id because id not match with database", async () => {
      let id = 99;
      const response = await request(app)
        .delete(`/products/${id}`)
        .set("Authorization", `Bearer ${access_token}`);
      // console.log(access_token);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", `Data not found`);
    });

    it("should be unsuccessfully delete product by id because staff updated who not belongs to them ", async () => {
      let id = 3;
      const response = await request(app)
        .delete(`/products/${id}`)
        .set("Authorization", `Bearer ${access_token_staff}`);
      // console.log(access_token);
      expect(response.status).toBe(403);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });
});

describe("Query Parameters", () => {
  it("should return paginated items", async () => {
    const response = await request(app)
    .get("/pub?page=1&limit=2");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("messages", "success find product");
    expect(response.body).toHaveProperty("product", expect.any(Array));
  });
  it("should return filtered items", async () => {
    const response = await request(app)
    .get("/pub?filter=1");
    expect(response.status).toBe(200);

    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("messages", "success find product");
    expect(response.body).toHaveProperty("product", expect.any(Array));
  });
  it("should return products without any parameters ", async () => {
    const response = await request(app)
    .get("/pub");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("messages", "success find product");
    expect(response.body).toHaveProperty("product", expect.any(Array));
  });
});

describe("GET /pub/:id", () => {
  it("should return product in public", async () => {
    let id = 5;
    const response = await request(app)
    .get(`/pub/5`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", `Success read product with id ${id}`);
    expect(response.body).toHaveProperty("product", expect.any(Object));
  });

  it("should not return product in public because id npt found", async () => {
    let id = 99;
    const response = await request(app)
    .get(`/pub/99`);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", `Data not found`);
  });
});
