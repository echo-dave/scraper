const mongoose = require('mongoose');

const Schema = mongoose.Schema

const ScrapeSchema = new Schema({
    title: String,
    summary: String,
    url: String,
    comments: [
        {
        type: Schema.Types.ObjectId,
        ref:"Comment"
        }
    ]
});

const Scrape = mongoose.model('Scrape',ScrapeSchema);

module.exports = Scrape;