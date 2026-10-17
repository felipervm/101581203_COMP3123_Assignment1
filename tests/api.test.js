const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;
let app;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri("comp3123_assignment1");
  process.env.JWT_SECRET = "test-secret-that-is-long-enough";
  process.env.JWT_EXPIRES_IN = "1h";
  process.env.NODE_ENV = "test";

  app = require("../src/app");
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe("COMP3123 Assignment 1 API", () => {
  test("health check returns 200", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("signup, login and protected employee CRUD work", async () => {
    const signup = await request(app)
      .post("/api/v1/user/signup")
      .send({
        username: "testusera",
        email: "testa@example.com",
        password: "StrongPass123!",
      });

    expect(signup.status).toBe(201);
    expect(signup.body.user.password).toBeUndefined();

    const login = await request(app)
      .post("/api/v1/user/login")
      .send({
        email: "testa@example.com",
        password: "StrongPass123!",
      });

    expect(login.status).toBe(200);
    expect(login.body.token).toBeTruthy();

    const token = login.body.token;

    const created = await request(app)
      .post("/api/v1/emp/employees")
      .set("Authorization", `Bearer ${token}`)
      .send({
        first_name: "Alice",
        last_name: "Analyst",
        email: "alice@example.com",
        position: "Analyst",
        salary: 70000,
        date_of_joining: "2026-01-15",
        department: "Data",
      });

    expect(created.status).toBe(201);

    const eid = created.body.employee._id;

    const found = await request(app)
      .get(`/api/v1/emp/employees/${eid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(found.status).toBe(200);

    const updated = await request(app)
      .put(`/api/v1/emp/employees/${eid}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        first_name: "Alice",
        last_name: "Analyst",
        email: "alice@example.com",
        position: "Senior Analyst",
        salary: 80000,
        date_of_joining: "2026-01-15",
        department: "Data",
      });

    expect(updated.status).toBe(200);
    expect(updated.body.employee.position).toBe("Senior Analyst");

    const deleted = await request(app)
      .delete(`/api/v1/emp/employees?eid=${eid}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleted.status).toBe(204);
  });

  test("cross-user employee access is forbidden", async () => {
    await request(app).post("/api/v1/user/signup").send({
      username: "ownera",
      email: "ownera@example.com",
      password: "StrongPass123!",
    });

    const loginA = await request(app).post("/api/v1/user/login").send({
      username: "ownera",
      password: "StrongPass123!",
    });

    await request(app).post("/api/v1/user/signup").send({
      username: "ownerb",
      email: "ownerb@example.com",
      password: "StrongPass123!",
    });

    const loginB = await request(app).post("/api/v1/user/login").send({
      username: "ownerb",
      password: "StrongPass123!",
    });

    const createdByB = await request(app)
      .post("/api/v1/emp/employees")
      .set("Authorization", `Bearer ${loginB.body.token}`)
      .send({
        first_name: "Bob",
        last_name: "Builder",
        email: "bob@example.com",
        position: "Developer",
        salary: 75000,
        date_of_joining: "2026-02-01",
        department: "Engineering",
      });

    const crossAccess = await request(app)
      .get(`/api/v1/emp/employees/${createdByB.body.employee._id}`)
      .set("Authorization", `Bearer ${loginA.body.token}`);

    expect(crossAccess.status).toBe(403);
  });
});
