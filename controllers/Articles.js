const scrape = require('../scripts/scrape');

const Article = require('../models/Article');

module.exports = {
    fetch: function (callback) {
        scrape(function (data) {
            const articles = data;
            for (let i = 0; i < articles.length; i++) {
                articles[i].saved = false;
            }

            Article.collection.insertMany(articles, { ordered: false }, function (error, docs) {
                callback(error, docs);
            });
        });
    },
    delete: function (query, callback) {
        Article.remove(query, callback);
    },
    get: function (query, callback) {
        Article.find(query).sort({
            _id: -1
        }).exec(function (err, doc) {
            callback(doc);
        });
    },
    update: function (query, callback) {
        Article.update({ _id: query._id }, {
            $set: query
        }, {}, callback);
    }
};