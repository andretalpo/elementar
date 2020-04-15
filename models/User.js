const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')
const { Schema } = mongoose;

const userSchema = new Schema({
  facebookId: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true, },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['admin', 'spec','member'], default: 'member' },
  active: { type: Boolean, required: true, default: true },
  votedNews: [{ type: mongoose.Types.ObjectId, ref: 'News'}],
});

userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

module.exports = User;
