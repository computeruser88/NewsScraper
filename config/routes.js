const articlesController = require("../controllers/Articles");
const notesController = require("../controllers/Notes");
const express = require("express");
const router = express.Router();

module.exports = function (router) {
    router.get("/", function (req, res) {
        res.render("home");
    });

    router.get("/saved", function (req, res) {
        res.render("saved");
    });

    router.get("/api/fetch", function(req, res) {
        articlesController.fetch(function(error, docs) {
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new articles for now."
                });
            } else {
                res.json({
                    message: "Added " + docs.insertedCount + " new articles!"
                });
            }
        });
    });

    router.get("/api/headlines", function(req, res) {
        let query = {};
        if (req.query.saved) {
            query = req.query;
        }
        articlesController.get(query, function(data) {
            res.json(data);
        });
    });

    router.delete("/api/headlines/:id", function(req, res) {
        let query = {};
        query._id = req.params.id;

        articlesController.delete(query, function(error, data) {
            res.json(data);
        });
    });

    router.patch("/api/headlines", function (req, res) {
        articlesController.update(req.body, function (error, data) {
            res.json(data);
        });
    });

    router.get("/api/notes/:headline_id?", function(req, res) {
        let query = {};
        if (req.params.headline_id) {
            query._id = req.params.headline_id;
        };

        notesController.get(query, function(error, data) {
            res.json(data);
        });
    });

    router.delete("/api/notes/:id", function(error, data) {
        let query = {};
        query._id = req.params.id;
        notesController.delete(query, function (error, data) {
            res.json(data);
        });
    });

    router.post("/api/notes", function(req, res) {
        notesController.save(req.body, function(data) {
            res.json(data);
        });
    });
};