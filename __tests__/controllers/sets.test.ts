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
let workoutId: string = "";

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
  it("Add Workout", async () => {
    const response = await request(app)
      .post(`${version}/workouts`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "Maintenance" });
    workoutId = response.body.data._id;
  });
  it("Get Initial Sets", async () => {
    const response = await request(app)
      .get(`${version}/sets?id=${workoutId}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toEqual(true);
    expect(response.body.data.length).toEqual(0);
    expect(response.status).toEqual(200);
  });

  it("Add Set", async () => {
    const newSet = {
      exerciseId: "62f1deb040fb5a76217f7151",
      workoutId,
      amount: 100,
    };
    const response = await request(app)
      .post(`${version}/sets`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(newSet);
    expect(response.body.success).toEqual(true);
    expect(response.body.data.workout._id).toEqual(workoutId);
    expect(response.body.data.amount).toEqual("100");
    expect(response.status).toEqual(201);
  });
  it("Get New Sets", async () => {
    const response = await request(app)
      .get(`${version}/sets?id=${workoutId}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toEqual(true);
    expect(response.body.data.length).toEqual(1);
    expect(response.status).toEqual(200);
  });

  it("Confirm Workout Removed", async () => {
    const response = await request(app)
      .delete(`${version}/workout?id=${workoutId}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toEqual(true);
    expect(response.body.data).toEqual("Success");
    expect(response.status).toEqual(200);
  });

  it("Check that Sets are removed", async () => {
    const response = await request(app)
      .get(`${version}/sets?id=${workoutId}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toEqual(false);
    expect(response.body.error).toEqual("Workout not found");
    expect(response.status).toEqual(404);
  });
});
