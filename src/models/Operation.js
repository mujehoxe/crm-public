// models/Operation.js
import mongoose from "mongoose";

const OperationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    module: { type: String, required: true },
    allowedRoles: [{ type: String }],
  },
  {
    indexes: [
      {
        fields: ["name", "module"],
        unique: true,
      },
    ],
  }
);

OperationSchema.index({ name: 1, module: 1 }, { unique: true });

OperationSchema.statics.groupByModule = async function () {
  return this.aggregate([
    {
      $group: {
        _id: "$module",
        operations: {
          $push: {
            name: "$name",
            allowedRoles: "$allowedRoles",
          },
        },
        firstAppearance: { $min: "$_id" }, // Store the ObjectId of the first document for this module
      },
    },
    {
      $sort: { firstAppearance: 1 }, // Sort by the first appearance of each module
    },
  ]);
};

export default mongoose.models.Operation ||
  mongoose.model("Operation", OperationSchema);
