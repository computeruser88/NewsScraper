const request = require("request");
const cheerio = require("cheerio");

const scrape = function(callback) {

    request("http://feeds.washingtonpost.com/rss/national"), function(err, res, body) {
        const $ = cheerio.load(body);
        let articles = [];

        $(".item").each(function(index, element) {
            const headline = $(this).children(".item .header a").text().trim();
            const sum = $(this).children(".item div").text().trim();
            if (head && summary) {
                const dataToAdd = {
                    title: headline,
                    summary: sum
                };
            articles.push(dataToAdd);
            }
        });
        callback(articles);
    }
}

module.exports = scrape;