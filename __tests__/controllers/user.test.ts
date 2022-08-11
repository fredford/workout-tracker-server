import request from "supertest";
import app from "../../src/index";

import { version } from "../../src/utils/variables";

let server: any;
beforeAll(async () => {
  server = app.listen(8181);
});

afterAll(() => {
  server.close();
});

let token: string = "";

/**
 * Test suite for GET User /profile
 */
describe("Test Users - GET User /profile", () => {
  // Test user already exists for register
  it("Add a User /register", async () => {
    const res = await request(app)
      .post(`${version}/register`)
      .set("Accept", "application/json")
      .send({ name: "Test1", email: "test1@test.com", password: "123456" });
    expect(res.body.success).toEqual(true);
    expect(res.status).toEqual(201);

    token = res.body.token;
  });
  // Check that the User was registered
  it("Get User", async () => {
    const response = await request(app)
      .get(`${version}/profile`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toEqual(true);
    expect(response.body.data.name).toEqual("Test1");
    expect(response.status).toEqual(200);
  });
});

/**
 * Test suite for Adding a Workout
 */
describe("Test Users - PUT User /profile", () => {
  it("Update a User", async () => {
    const name = "Test2";
    const theme = "dark";
    const response = await request(app)
      .put(`${version}/profile`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ name, theme });
    expect(response.body.success).toEqual(true);
    expect(response.body.data.name).toEqual(name);
    expect(response.body.data.theme).toEqual(theme);
    expect(response.status).toEqual(200);
  });

  it("Update a User back", async () => {
    const name = "Test1";
    const theme = "light";
    const response = await request(app)
      .put(`${version}/profile`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ name, theme });
    expect(response.body.success).toEqual(true);
    expect(response.body.data.name).toEqual(name);
    expect(response.body.data.theme).toEqual(theme);
    expect(response.status).toEqual(200);
  });

  it("Update User - Missing body", async () => {
    const response = await request(app)
      .put(`${version}/profile`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toEqual(false);
    expect(response.body.error).toEqual("Request body not provided");
    expect(response.status).toEqual(400);
  });

  it("Update User - Invalid name", async () => {
    const name = "hi";
    const response = await request(app)
      .put(`${version}/profile`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ name });
    expect(response.body.success).toEqual(false);
    expect(response.body.error).toEqual("Invalid name provided");
    expect(response.status).toEqual(400);
  });

  it("Update User - Invalid theme", async () => {
    const theme = "other";
    const response = await request(app)
      .put(`${version}/profile`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ theme });
    expect(response.body.success).toEqual(false);
    expect(response.body.error).toEqual("Invalid theme provided");
    expect(response.status).toEqual(400);
  });
  it("Update User - Invalid password", async () => {
    const password = "12345";
    const response = await request(app)
      .put(`${version}/profile`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ password });
    expect(response.body.success).toEqual(false);
    expect(response.body.error).toEqual("Invalid password provided");
    expect(response.status).toEqual(400);
  });
});

/**
 * Test suite for GET User /profile
 */
describe("Test Users - DELETE User /profile", () => {
  it("Delete User", async () => {
    const response = await request(app)
      .delete(`${version}/profile`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toEqual(true);
    expect(response.body.data).toEqual("Success");
    expect(response.status).toEqual(200);
  });
});
