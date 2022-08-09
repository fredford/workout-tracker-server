import request from "supertest"
import app from "../../src/index"

import {version} from "../../src/utils/variables"

let server: any;
beforeAll(async () => {
  server = app.listen(8181)
})

afterAll(() => {
    server.close()
  }
)

/**
 * Test Suite for /exercises endpoint
 */
describe('Test Exercises - getExercises', () => {

  let token: string = ""

  it('Get User', async () => {
    const response = await request(app)
      .post(`${version}/login`)
      .set('Accept', 'application/json')
      .send({"email": "test@test.com", password: "123456"})

    token = response.body.token
  })

  // Get Exercises for Test User
  it('Check all exercises are sent /exercises', async () => {

    const res2 = await request(app)
      .get(`${version}/exercises`)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${token}`)
    expect(res2.body.success).toEqual(true)
    expect(res2.body.data.length).toEqual(4)
    expect(res2.status).toEqual(200)
  })
  // Get Exercise by ID for Test User
  it('Check a specific exercise is returned /exercises', async () => {

    const exerciseId: string = "62f1deb040fb5a76217f7151"

    const res2 = await request(app)
      .get(`${version}/exercises?id=${exerciseId}`)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${token}`)
    expect(res2.body.success).toEqual(true)
    expect(res2.body.data.name).toEqual("Push-ups")
    expect(res2.status).toEqual(200)
  })

  // Get Exercise by ID for invalid ID
  it('Check no exercise is returned for invalid ID /exercises', async () => {

    const exerciseId2: string = "12345"

    const res2 = await request(app)
      .get(`${version}/exercises?id=${exerciseId2}`)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${token}`)
    expect(res2.body.success).toEqual(false)
    expect(res2.body.error).toEqual("Exercise ID not valid")
    expect(res2.status).toEqual(404)
  })

  // Get Exercise by ID for Test User
  it('Check no exercise is returned for valid ObjectId /exercises', async () => {

    const exerciseId2: string = "62f1deb040fb5a76217f7152"

    const res2 = await request(app)
      .get(`${version}/exercises?id=${exerciseId2}`)
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${token}`)
    expect(res2.body.success).toEqual(false)
    expect(res2.body.error).toEqual("Exercise not found")
    expect(res2.status).toEqual(404)
  })
})