const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const buyerSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String,
  dob: String,
  passport: String,
  passportExpiry: String,
  passportFront: String,
  passportBack: String,
  nationality: String,
  resident: String,
  emiratesId: String,
  emiratesExpiry: String,
  emiratesPhoto: String,
  address: String,
});

const invoiceSchema = new mongoose.Schema({
  Userid: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  Leadid: { type: mongoose.Schema.Types.ObjectId, ref: "Leads" },
  timestamp: { type: Date, default: Date.now },
  type: String,
  buyer: buyerSchema,
  EOI: String,
  Ready: String,
  Closure: String,
  Booking: String,
  Handover: String,
  Property: String,
  Developer: String,
  Bed: String,
  BUA: String,
  PlotArea: String,
  ProjectName: String,
  PlotNumber: String,
  Unitaddress: String,
  Price: String,
  Comission: String,
  ComissionType: String,
  SpotCash: String,
  TotalComission: String,
  VAT: String,
  ComissionVAT: String,
  othrDeveloper: String,
  External: String,
  TotalComission: String,
  visaphoto: String,
  eoireciept: String,
  bookingfrom: String,
  spacopy: String,
  approved: { type: String, default: "100" },
  assigneddate: String,
  loyaltyBonus: String,
  agentname: String,
  cancelreason: String,
  eoiimage: String,
  bookingmage: String,
  SPAmage: String,
  KYCimage: String,
  UNimage: String,
  Invoicenumber: String,
  Riskimage: String,
  Sanctionimage: String,
  mshreComission: String,
  agentComissionPercent: Number,
  agentComissionAED: Number,
  mshregros: Number,
  tlComissionPercent: Number,
  tlComissionAED: Number,
  smComissionPercent: Number,
  smComissionAED: Number,
  exAgentsComissionPercent: Number,
  exAgentsComissionAED: Number,
  exTLComissionPercent: Number,
  exTLComissionAED: Number,
  exAgentsComissionPercent: Number,
  exSMComissionPercent: Number,
  exSMComissionAED: Number,
  Reasons: String,
  tAgentComissiontoAgent: String,
  bhComission: String,
  tComssiontoAgen_Bh: String,
  comissionToCompanyAED: String,
  tAgentPercentComissionToAgent: String,
  bhPercentComission: String,
  TbhPercentComissiontoAgent: String,
  comissiontoCompanyPercent: String,
  comissionStatustoAgent: String,
  additionalComments: String,
  newTitleDeedNumber: String,
  titleNumber: String,
  contractNumber: String,
  dewaPremises: String,
  cancelledPrice: String,
  fullComission: String,
  claim3: String,
  claim2: String,
  claim1: String,
  TA: String,
  sourceLeads: String,
  securityDeposit: String,
  cheques: String,
  contractEndDate: String,
  comissionStatustoAgent: String,
  contractEndDate: String,
  additionalComments2: String,
  dealStatus: String,
  directIndirectTenant: String,
  directIndirectOwner: String,
  remarks: String,
  dealType: String,
  saleRent: String,
  unitNumber: String,
  mode: String,
  netcom: String,
  atlComissionPercent: String,
  atlComissionAED: String,
  submittedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  approvedby: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  additionalBuyers: [buyerSchema],
  buyerImages: [],
  additinalkyc: [],
  timestamp: { type: Date, default: Date.now },
});

const Invoice =
  mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

async function migrateInvoices() {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to the database");

    // Find all invoices
    const invoices = await Invoice.find().lean();

    console.log(`Found ${invoices.length} invoices`);

    let count = 0;

    for (let invoice of invoices) {
      // Create a new buyer object
      const buyer = {
        name: invoice.buyername,
        email: invoice.buyerEmail,
        contact: invoice.buyerContact,
        dob: invoice.buyerdob,
        passport: invoice.buyerpassport,
        passportExpiry: invoice.passportexpiry,
        passportFront: invoice.passfront,
        passportBack: invoice.passback,
        nationality: invoice.nationality,
        resident: invoice.Resident,
        emiratesId: invoice.emiratesid,
        emiratesExpiry: invoice.emiratesExpiry,
        emiratesPhoto: invoice.emiratephoto,
        address: invoice.address,
      };

      // Update the invoice document
      await Invoice.updateOne(
        { _id: invoice._id },
        {
          $set: {
            buyer: buyer,
            // Remove old buyer fields
            buyername: undefined,
            buyerEmail: undefined,
            buyerContact: undefined,
            buyerdob: undefined,
            buyerpassport: undefined,
            buyerexpiry: undefined,
            buyernationality: undefined,
            buyerResident: undefined,
            buyeremiratesExpiry: undefined,
            buyeremiratesid: undefined,
            buyeraddress: undefined,
          },
        }
      );

      count++;
      if (count % 100 === 0) {
        console.log(`Processed ${count} invoices`);
      }
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await mongoose.disconnect();
  }
}

migrateInvoices();
