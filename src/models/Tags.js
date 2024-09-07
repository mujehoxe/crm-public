import mongoose from "mongoose";

const TagsSchema = new mongoose.Schema({
  AddBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },

  Tag: {
    type: String,
    required: [true, "Please provide a Tag"],
    unique: true,
  },
  type: {
    type: String,
    required: [true, "Please provide a type"],
  },
  timestamp: { type: Date, default: Date.now },
});

TagsSchema.index({ Tag: 1, type: 1 }, { unique: true });
const TagsModel = mongoose.models.Tags || mongoose.model("Tags", TagsSchema);

export default TagsModel;
