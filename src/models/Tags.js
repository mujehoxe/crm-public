import mongoose from "mongoose";

const TagsSchema = new mongoose.Schema({
  AddBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },

  Tag: {
    type: String,
    required: [true, "Please provide a Tag"],
    unique: true,
  },
  timestamp: { type: Date, default: Date.now },
  type: String,
});

const TagsModel = mongoose.models.Tags || mongoose.model("Tags", TagsSchema);

export default TagsModel;
