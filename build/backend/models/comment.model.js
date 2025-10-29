import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;