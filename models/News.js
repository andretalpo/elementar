const mongoose = require('mongoose');
const { Schema } = mongoose;

const newsSchema = new Schema({
    title: { type: String, required: true },
    newsUrl: { type: String, required: true, unique: true },
    specText: { type: String },
    sourceUrl: { type: String },
    fakeVotes: { type: Number, min: 0, default: 0 },
    truthVotes: { type: Number, min: 0, default: 0 },
    active: { type: Boolean, required: true, default: true },
    creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    spec: { type: mongoose.Types.ObjectId, ref: 'User' },
    votingUsers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    //retorno da API
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
