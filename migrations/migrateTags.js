const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const LeadsSchema = new mongoose.Schema({
  Source: { type: mongoose.Schema.Types.ObjectId, ref: "Source" },
  LeadStatus: { type: mongoose.Schema.Types.ObjectId, ref: "Status" },

  Assigned: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  Name: { type: String },
  Score: {
    type: Number,
    default: 0, // or whatever default value you want
  },
  Phone: {
    type: Number,
    required: [true, "Please provide a Phone"],
  },
  AltPhone: { type: Number },
  Address: { type: String },
  Email: { type: String },
  typeprop: { type: String },
  City: { type: String },

  Project: { type: String },
  Budget: { type: String },
  Country: { type: String },
  Location: { type: String },
  ZipCode: { type: String },

  Type: { type: String },
  Description: { type: String },
  status: {
    type: String,
    default: "new",
  },
  LeadType: { type: String },
  scoreupdateby: { type: String },
  campagincountry: { type: String },
  campaignid: { type: String },
  adid: { type: String },
  Doneby: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tags" }],
  marketingtags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tags" }],
  unitnumber: { type: String },
  statusCount: { type: Number, default: 0 },
  LeadAssignedDate: { type: Date },
  timestamp: {
    type: String,
    default: () => new Date().toISOString().slice(0, 10),
  },
});

const Leads = mongoose.models.Leads || mongoose.model("Leads", LeadsSchema);

async function migrateTags() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    const leads = await Leads.find({});

    for (const lead of leads) {
      if (lead.tags && !Array.isArray(lead.tags)) {
        lead.tags = lead.tags ? [lead.tags] : [];
      }

      if (lead.marketingtags && !Array.isArray(lead.marketingtags)) {
        lead.marketingtags = lead.marketingtags ? [lead.marketingtags] : [];
      }

      await lead.save();
      console.log(`Updated lead: ${lead._id}`);
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

migrateTags();
