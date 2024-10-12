import mongoose from "mongoose";

const InvoiceFieldSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  visibleTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  type: { type: mongoose.Schema.Types.ObjectId, ref: "InvoiceFieldType" },
});

export default mongoose.models.InvoiceField ||
  mongoose.model("InvoiceField", InvoiceFieldSchema);
