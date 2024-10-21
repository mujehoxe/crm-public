import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
  DateTime: {
    type: String,
    required: [true, "Please provide a DateTime"],
  },

  Assignees: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },

  Leadid: { type: mongoose.Schema.Types.ObjectId, ref: "Leads" },

  Comment: {
    type: String,
    required: [true, "Please provide a Comment"],
  },
  timestamp: { type: Date, default: Date.now },
});

ReminderSchema.post("save", async function (doc, next) {
  await doc.populate([
    {
      path: "Leadid",
      populate: { path: "Assigned" }, // Nested population
    },
    { path: "Assignees" },
  ]);

  next();
});

const Reminder =
  mongoose.models.Reminder || mongoose.model("Reminder", ReminderSchema);

export default Reminder;
