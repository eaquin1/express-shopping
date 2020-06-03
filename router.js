const express = require("express");
const router = new express.Router();
const ExpressError = require("./expressError");
const items = require("./fakeDb");

router.get("/", (req, res, next) => {
    res.json({ items });
});

router.post("/", (req, res, next) => {
    try {
        if (!req.body.name) throw new ExpressError("Item is required", 400);
        const newItem = { name: req.body.name, price: req.body.price };
        items.push(newItem);
        return res
            .status(201)
            .json({ name: newItem.name, price: newItem.price });
    } catch (e) {
        return next(e);
    }
});

router.get("/:name", (req, res) => {
    const foundItem = items.find((item) => item.name === req.params.name);
    if (foundItem === undefined) {
        throw new ExpressError("Item not found", 404);
    }
    res.json({ name: foundItem.name, price: foundItem.price });
});

router.patch("/:name", (req, res) => {
    const foundItem = items.find((item) => item.name === req.params.name);
    if (foundItem === undefined) {
        throw new ExpressError("Item not found", 404);
    }
    foundItem.name = req.body.name;
    foundItem.price = req.body.price;
    res.json({ item: foundItem });
});

router.delete("/:name", (req, res) => {
    const foundItem = items.findIndex((item) => item.name === req.params.name);
    if (foundItem === -1) {
        throw new ExpressError("Item not found", 404);
    }
    items.splice(foundItem, 1);
    res.json({ message: "Deleted" });
});

module.exports = router;
