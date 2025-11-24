// app.test.js
const request = require("supertest");
const app = require("./app"); // Import the app logic

let server; // Define a variable to hold the server instance

// This block runs once before all tests
beforeAll((done) => {
  // Start the server on a specific port for testing
  server = app.listen(3000, () => {
    console.log("Test server running on port 3000");
    done(); // Signal that the setup is complete
  });
});

// This block runs once after all tests are finished
afterAll((done) => {
  // Shut down the server and release the port
  server.close(done);
});

describe("GET /time", () => {
  it("should return a valid ISO timestamp", async () => {
    const res = await request(server).get("/time");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("time");
    expect(typeof res.body.time).toBe("string");

    // validate ISO timestamp
    expect(() => new Date(res.body.time)).not.toThrow();
  });
});
