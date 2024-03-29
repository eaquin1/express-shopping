process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");
let item = { name: "hotdog", price: 20 };

beforeEach(() => {
    items.push(item);
});

afterEach(() => {
    items.length = 0;
    // redeclaring items causes patch test to fail
    //items = [];
});

describe("GET /items", () => {
    it("gets an array of items", async () => {
        const resp = await request(app).get("/items");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ items: items });
        expect(items).toHaveLength(1);
    });
});

describe("GET /items/:name", () => {
    it("gets a single item", async () => {
        const resp = await request(app).get(`/items/${item.name}`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(item);
    });

    it("responds with 404 if item doesn't exist", async () => {
        const resp = await request(app).get("/items/cookies");
        expect(resp.statusCode).toBe(404);
    });
});

describe("POST /items", () => {
    it("adds an item", async () => {
        const resp = await request(app)
            .post("/items")
            .send({ name: "spaghetti", price: 30 });
        expect(resp.statusCode).toBe(201);
        expect(resp.body.name).toEqual("spaghetti");
    });
    it("responds with 403 if the item already exists", async () => {
        const resp = await request(app).post("/items").send(item);
        expect(resp.statusCode).toBe(403);
    });
    it("responds with 400 if data is not sent", async () => {
        const resp = await request(app).post("/items").send({});
        expect(resp.statusCode).toBe(400);
    });
});

describe("DELETE /items/:name", () => {
    it("successfully deletes item", async () => {
        const resp = await request(app).delete(`/items/${item.name}`);
        expect(resp.statusCode).toBe(200);
    });
    it("responds 404 with if item not found", async () => {
        const resp = await request(app).delete("/items/pizza");
        expect(resp.statusCode).toBe(404);
    });
});

describe("PATCH /items/:name", () => {
    it("updates a single item", async () => {
        const resp = await request(app)
            .patch(`/items/${item.name}`)
            .send({ name: "pizza", price: 34 });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ item: { name: "pizza", price: 34 } });
    });

    it("responds with a 404 if it can't find item", async () => {
        const resp = await request(app)
            .patch("/items/soup")
            .send({ name: "pizza", price: 25 });
        expect(resp.statusCode).toBe(404);
    });
});
