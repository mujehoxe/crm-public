import mongoose from "mongoose";

const InvoiceFieldTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  options: [{ type: String }],
  alt: { type: String },
});

export default mongoose.models.InvoiceFieldType ||
  mongoose.model("InvoiceFieldType", InvoiceFieldTypeSchema);
