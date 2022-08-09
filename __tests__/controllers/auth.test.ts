import request from "supertest"

import app from "../../src/index"

import {version} from "../../src/utils/variables"


let server: any;
beforeAll(async () => {
  server = app.listen(8180)
})
afterAll(() => {
    server.close()
  }
)

/**
 * Test Suite for /register endpoint
 */
describe('Test Auth - Register', () => {
  // Test user already exists for register
  it('Checks user already exists /register', async () => {
    const res = await request(app)
      .post(`${version}/register`)
      .set('Accept', 'application/json')
      .send({"name": "Test", "email": "test@test.com", password: "123456"})
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual("User already exists!")
    expect(res.status).toEqual(409)
  })
  // Test missing information for register
  it('Checks missing name /register', async () => {
    const res = await request(app)
      .post(`${version}/register`)
      .set('Accept', 'application/json')
      .send({"email": "test@test.com", password: "123456"})
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual("Please provide a name")
    expect(res.status).toEqual(400)
  })
  // Test missing information for register
  it('Checks missing email /register', async () => {
    const res = await request(app)
      .post(`${version}/register`)
      .set('Accept', 'application/json')
      .send({"name": "Test", password: "123456"})
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual("Please provide an email")
    expect(res.status).toEqual(400)
  })
  // Test missing information for register
  it('Checks missing email /register', async () => {
    const res = await request(app)
      .post(`${version}/register`)
      .set('Accept', 'application/json')
      .send({"name": "Test", "email": "test@test.com"})
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual("Please provide a password")
    expect(res.status).toEqual(400)
  })
})

/**
 * Test Suite for /login endpoint
 */
describe('Test Auth - Login', () => {
  // Test a valid login attempt
  it('Checks valid /login', async () => {
    const res = await request(app)
      .post(`${version}/login`)
      .set('Accept', 'application/json')
      .send({"email": "test@test.com", password: "123456"})
    expect(res.body.success).toEqual(true)
    expect(res.status).toEqual(200)
  })
  // Test response from a bad login attempt, missing email
  it('Checks missing email /login', async () => {
    const res = await request(app)
      .post(`${version}/login`)
      .set('Accept', 'application/json')
      .send({password: "123456"})
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual("Please provide an email and password")
    expect(res.status).toEqual(400)
  })
  // Test response from a bad login attempt, missing password
  it('Checks missing password /login', async () => {
    const res = await request(app)
      .post(`${version}/login`)
      .set('Accept', 'application/json')
      .send({email: "email@email.com"})
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual("Please provide an email and password")
    expect(res.status).toEqual(400)
  })
  // Test response from a bad login attempt, bad email
  it('Checks bad user /login', async () => {
    const res = await request(app)
      .post(`${version}/login`)
      .set('Accept', 'application/json')
      .send({"email": "email@email.com", password: "123456"})
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual("Invalid user credentials")
    expect(res.status).toEqual(404)
  })
  // Test response from a bad login attempt, bad password
  it('Checks bad password /login', async () => {
    const res = await request(app)
      .post(`${version}/login`)
      .set('Accept', 'application/json')
      .send({"email": "test@test.com", password: "testpass"})
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual("Invalid password credentials")
    expect(res.status).toEqual(401)
  })
})
/**
 * Test Suite for /forgotpassword endpoint
 */
describe('Test Forgot Password', () => {
  // Test response from valid forgotpassword request
  it('Checks valid /forgotpassword', async () => {
    const res = await request(app)
      .post(`${version}/forgotpassword`)
      .set('Accept', 'application/json')
      .send({"email": "test@test.com"})
    expect(res.body.success).toEqual(true)
    expect(res.body.data).toEqual("Email Sent")
    expect(res.status).toEqual(200)
  })

  // Test response from bad email for forgotpassword
  it('Checks bad email /forgotpassword', async () => {
    const res = await request(app)
      .post(`${version}/forgotpassword`)
      .set('Accept', 'application/json')
      .send({"email": "email@email.com"})
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual("Email could not be sent")
    expect(res.status).toEqual(404)
  })

  // Test response from missing email for forgotpassword
  it('Checks missing email /forgotpassword', async () => {
    const res = await request(app)
      .post(`${version}/forgotpassword`)
      .set('Accept', 'application/json')
      .send({})
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual("Please provide an email")
    expect(res.status).toEqual(400)
  })
})














































