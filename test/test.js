const supertest = require("supertest");
const app = require("../src/server");
//const requestWithSupertest = supertest(server.listen(80));

let server = null;
let request = null;

beforeAll(() => {
  server = app.listen(80);
  request = supertest.agent(server);
});

afterAll(() => {
  server.close();
});

describe("ROOT", () => {
  it("GET: ", async () => {
    const res = await request.get("/api");

    expect(res.body.status).toEqual("success");
  });
});

describe("LAPSZABÁSZAT", () => {
  it("GET: ", async () => {
    const res = await request.get("/api/lapszabaszat");

    expect(res.body.status).toEqual("success");
  });
  it("POST: ", async () => {
    const res = await request
      .post("/api/lapszabaszat")
      .send({ adatok: { data: "placed" } });

    const resFailed = await request.post("/api/lapszabaszat");

    expect(res.body.status).toEqual("success");
    expect(resFailed.body.status).toEqual("failed");
  });
});

describe("FIÓK ELŐLAP", () => {
  it("GET: ", async () => {
    const res = await request.get("/api/fiokelolap");

    expect(res.body.status).toEqual("success");
  });
  it("POST: ", async () => {
    const res = await request
      .post("/api/fiokelolap")
      .send({ adatok: { data: "placed" } });

    const resFailed = await request.post("/api/fiokelolap");

    expect(res.body.status).toEqual("success");
    expect(resFailed.body.status).toEqual("failed");
  });
});
