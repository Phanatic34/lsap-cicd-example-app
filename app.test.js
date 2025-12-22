// app.test.js
const request = require("supertest");
const app = require("./app");

let server;

beforeAll((done) => {
  server = app.listen(3000, () => {
    console.log("Test server running on port 3000");
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

//
// Test 1: root endpoint
//
describe("GET /", () => {
  it("should return a welcome message", async () => {
    const res = await request(server).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Welcome DEV demo v2!");
  });
});

//
// Test 2: /time endpoint
//
describe("GET /time", () => {
  it("should return a valid ISO timestamp", async () => {
    const res = await request(server).get("/time");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("time");
    expect(typeof res.body.time).toBe("string");

    expect(() => new Date(res.body.time)).not.toThrow();
  });
});
