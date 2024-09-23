import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  LeadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Leads",
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  Content: {
    type: String,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export default Comment;
