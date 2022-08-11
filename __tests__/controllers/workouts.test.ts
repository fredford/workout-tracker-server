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
 * Test suite for getting all Workouts
 */
describe("Test Workouts - GET Workouts", () => {
  it("Get User", async () => {
    const response = await request(app)
      .post(`${version}/login`)
      .set("Accept", "application/json")
      .send({ email: "test@test.com", password: "123456" });

    token = response.body.token;
  });
  it("Get all workouts", async () => {
    const response = await request(app)
      .get(`${version}/workouts`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toEqual(true);
    expect(response.body.data.length).toEqual(2);
    expect(response.status).toEqual(200);
  });
});

let workoutId: string;

/**
 * Test suite for Adding a Workout
 */
describe("Test Workouts - POST Workout", () => {
  it("Add a Workout", async () => {
    let workoutType = "Maintenance";
    const response = await request(app)
      .post(`${version}/workouts`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: workoutType });
    expect(response.body.success).toEqual(true);
    expect(response.body.data.type).toEqual(workoutType);
    expect(response.status).toEqual(201);

    workoutId = response.body.data._id;
  });
});

/**
 * Test suite for Adding a Workout
 */
describe("Test Workouts - GET Last Workout", () => {
  it("GET Last Workout", async () => {
    let workoutType = "Maintenance";
    const response = await request(app)
      .get(`${version}/lastworkout`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toEqual(true);
    expect(response.body.data.id).toEqual(workoutId);
    expect(response.body.data.type).toEqual(workoutType);
    expect(response.status).toEqual(200);
  });
});

/**
 * Test suite for Adding a Workout
 */
describe("Test Workouts - GET Workout by ID", () => {
  it("GET a Workout by ID", async () => {
    let workoutType = "Maintenance";
    const response = await request(app)
      .get(`${version}/workout?id=${workoutId}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toEqual(true);
    expect(response.body.data.type).toEqual(workoutType);
    expect(response.status).toEqual(200);
  });
});

/**
 * Test suite for Adding a Workout
 */
describe("Test Workouts - DELETE Workout", () => {
  it("Delete a Workout by ID", async () => {
    const response = await request(app)
      .delete(`${version}/workout?id=${workoutId}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toEqual(true);
    expect(response.body.data).toEqual("Success");
    expect(response.status).toEqual(200);
  });
});
