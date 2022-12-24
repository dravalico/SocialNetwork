const express = require("express");
const router = express.Router();
const db = require("./db.js");

const CollectionsNames = {
    Users: "users",
    Messages: "messages",
};

router.post("/auth/signup", (req, res) => {});

router.post("/auth/signin", (req, res) => {});

router.get("/social/users/:id", async (req, res) => {});

router.get("/social/messages/:userId", (req, res) => {});

router.get("/social/messages/:userId/:idMsg", (req, res) => {});

router.post("/social/messages", (req, res) => {});

router.get("/social/followers/:id", (req, res) => {});

router.post("/social/followers/:id", (req, res) => {});

router.delete("/social/followers/:id", (req, res) => {});

router.get("/social/feed", async (req, res) => {});

router.post("/social/like/:idMessage", (req, res) => {});

router.delete("/social/like/:idMessage", (req, res) => {});

router.get("/social/search?q=query", (req, res) => {});

router.get("/social/whoami", (req, res) => {});

module.exports = router;
