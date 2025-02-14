const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

let server;
jest.setTimeout(100000);

beforeAll((done) => {
  server = app.listen(5001, () => {
    console.log("Test server running on port 5001");
    done();
  });
});

afterAll(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.connection.close();
});

describe("User Authentication & File API Tests", () => {
  let authToken;
  let uploadedFileKey;

  const testUser = {
    username: "testuser",
    email: `test${Date.now()}@example.com`,
    password: "password123",
  };

  it("should register a new user successfully", async () => {
    const res = await request(server)
      .post("/api/v1/auth/register")
      .send(testUser);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should log in a user successfully and return a token", async () => {
    const res = await request(server).post("/api/v1/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    authToken = res.body.token;
  });

  it("should fail to log in with incorrect credentials", async () => {
    const res = await request(server).post("/api/v1/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid password");
  });

  it("should upload a file successfully", async () => {
    const res = await request(server)
      .post("/api/v1/upload")
      .set("Authorization", authToken)
      .attach("file", "./tum.mp3");

    expect(res.status).toBe(200);
    expect(res.body.url).toBeDefined();
    uploadedFileKey = res.body.url.split("/").pop();
  });

  it("should return all uploaded media for authenticated users", async () => {
    const res = await request(server)
      .get("/api/v1/media")
      .set("Authorization", authToken);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should stream an uploaded file successfully", async () => {
    if (!uploadedFileKey) throw new Error("File key is missing");

    const res = await request(server).get(`/api/v1/stream/${uploadedFileKey}`);
    expect(res.status).toBe(200);
    expect(res.headers["content-length"]).toBeDefined();
  });

  it("should return 404 for an invalid file key", async () => {
    const res = await request(server).get("/api/v1/stream/INVALID_KEY");
    expect(res.status).toBe(500);
  });
});
