const mongoose = require('mongoose');

const Schema = mongoose.Schema

const ScrapeSchema = new Schema({
    title: String,
    summary: String,
    url: String
});

const Scrape = mongoose.model('Scrape',ScrapeSchema);

module.exports = Scrape;