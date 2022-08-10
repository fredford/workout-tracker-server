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
 * Test Suite for /exercises endpoint
 */
describe("Test Exercises - getExercises", () => {
  it("Get User", async () => {
    const response = await request(app)
      .post(`${version}/login`)
      .set("Accept", "application/json")
      .send({ email: "test@test.com", password: "123456" });

    token = response.body.token;
  });

  // Get Exercises for Test User
  it("Check all exercises are sent /exercises", async () => {
    const res2 = await request(app)
      .get(`${version}/exercises`)
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${token}`);
    expect(res2.body.success).toEqual(true);
    expect(res2.body.data.length).toEqual(4);
    expect(res2.status).toEqual(200);
  });
  // Get Exercise by ID for Test User
  it("Check a specific exercise is returned /exercises", async () => {
    const exerciseId: string = "62f1deb040fb5a76217f7151";

    const res2 = await request(app)
      .get(`${version}/exercises?id=${exerciseId}`)
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${token}`);
    expect(res2.body.success).toEqual(true);
    expect(res2.body.data.name).toEqual("Push-ups");
    expect(res2.status).toEqual(200);
  });

  // Get Exercise by ID for invalid ID
  it("Check no exercise is returned for invalid ID /exercises", async () => {
    const exerciseId2: string = "12345";

    const res2 = await request(app)
      .get(`${version}/exercises?id=${exerciseId2}`)
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${token}`);
    expect(res2.body.success).toEqual(false);
    expect(res2.body.error).toEqual("Exercise ID is invalid");
    expect(res2.status).toEqual(400);
  });

  // Get Exercise by ID for Test User
  it("Check a valid exercise is not accessible /exercises", async () => {
    const exerciseId: string = "62f341342acd590c4f5a0547";

    const res2 = await request(app)
      .get(`${version}/exercises?id=${exerciseId}`)
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${token}`);
    expect(res2.body.success).toEqual(false);
    expect(res2.body.error).toEqual("Dips is not accessible");
    expect(res2.status).toEqual(403);
  });

  // Get Exercise by ID for Test User
  it("Check no exercise is returned for valid ObjectId /exercises", async () => {
    const exerciseId2: string = "62f1deb040fb5a76217f7152";

    const res2 = await request(app)
      .get(`${version}/exercises?id=${exerciseId2}`)
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${token}`);
    expect(res2.body.success).toEqual(false);
    expect(res2.body.error).toEqual("Exercise not found");
    expect(res2.status).toEqual(404);
  });
});

let exerciseId: string;

describe("Test Add Exercise - POST", () => {
  // Add an Exercise for the Test User
  it("Add valid exercise to /exercises", async () => {
    let exercise = {
      name: "Test Exercise",
      area: "Upper",
      type: "Repetitions",
    };

    const res2 = await request(app)
      .post(`${version}/exercises`)
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${token}`)
      .send(exercise);
    expect(res2.body.success).toEqual(true);
    expect(res2.body.data.name).toEqual("Test Exercise");
    expect(res2.status).toEqual(201);

    exerciseId = res2.body.data._id;
  });
  // Invalid add for the Test User
  it("Missing name add to /exercises", async () => {
    let exercise = {
      area: "Upper",
      type: "Repetitions",
    };

    const res2 = await request(app)
      .post(`${version}/exercises`)
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${token}`)
      .send(exercise);
    expect(res2.body.success).toEqual(false);
    expect(res2.body.error).toEqual("Please provide a name");
    expect(res2.status).toEqual(400);
  });
});

describe("Test Delete Exercise - DELETE", () => {
  // Delete Exercise for Test User
  it("Delete an Exercise from /exercises", async () => {
    const res2 = await request(app)
      .delete(`${version}/exercises?id=${exerciseId}`)
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${token}`);
    expect(res2.body.success).toEqual(true);
    expect(res2.body.data).toEqual("Success");
    expect(res2.status).toEqual(200);
  });

  // Attempt to delete inaccessible Exercise
  it("Delete inaccessible Exercise /exercises", async () => {
    let id = "62f1deb040fb5a76217f7151";

    const res2 = await request(app)
      .delete(`${version}/exercises?id=${id}`)
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${token}`);
    expect(res2.body.success).toEqual(false);
    expect(res2.body.error).toEqual("User cannot delete exercise");
    expect(res2.status).toEqual(403);
  });

  // Attempt to delete invalid Exercise
  it("Delete invalid Exercise /exercises", async () => {
    let id = "12345";

    const res2 = await request(app)
      .delete(`${version}/exercises?id=${id}`)
      .set("Accept", "application/json")
      .set("authorization", `Bearer ${token}`);
    expect(res2.body.success).toEqual(false);
    expect(res2.body.error).toEqual("Exercise ID is invalid");
    expect(res2.status).toEqual(400);
  });
});
