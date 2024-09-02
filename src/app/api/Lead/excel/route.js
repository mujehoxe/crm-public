import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import connect from "@/dbConfig/dbConfig";
import Leads from "@/models/Leads";
import TagsModel from "@/models/Tags";
import StatusModel from "@/models/Status";
import Source from "@/models/Source";
import User from "@/models/Users";
import jwt from "jsonwebtoken";
// Connect to the database
connect();

async function parseCSVAndSaveToDB(csvData, LeadStatus, userIdyoken) {
  const parsedData = await parseCSV(csvData);
  const leadsToSave = [];

  for (const lead of parsedData) {
    let marketingtag = await TagsModel.findOne({ Tag: lead.form_name });
    if (!marketingtag) {
      console.log(
        `Marketing tag with name ${lead.form_name} not found, creating new tag...`
      );
      marketingtag = new TagsModel({ Tag: lead.form_name, AddBy: userIdyoken });
      try {
        await marketingtag.save();
        console.log(`Created new marketing tag with name ${lead.form_name}`);
      } catch (error) {
        console.error(`Error creating marketing tag ${lead.form_name}:`, error);
        continue;
      }
    }

    const marketingtagId = marketingtag._id;
    console.log("Marketing tag ID:", marketingtagId);

    const existingLead = await Leads.findOne({
      Phone: lead.Phone,
      marketingtags: marketingtagId,
    });
    if (existingLead) {
      console.log(
        `Lead with phone number ${lead.Phone} and tag ${marketingtagId} already exists, skipping...`
      );
      continue;
    }
    let dldtagId = "";
    if (lead.tags) {
      const dldtag = await TagsModel.findOne({ Tag: lead.tags });
      if (!dldtag) {
        console.log(
          `DLD tag with name ${lead.tags} not found, skipping lead...`
        );
        continue;
      }
      dldtagId = dldtag._id;
    }

    const user = await User.findOne({
      username: { $regex: new RegExp(lead.agent, "i") },
    });
    if (!user) {
      console.log(
        `User with username ${lead.agent} not found, skipping lead...`
      );
      continue;
    }
    const userid = user._id;

    let source = "";
    if (lead.source === "fb") {
      source = "SM3";
    } else if (lead.source === "ig") {
      source = "SM4";
    }
    const sourcelead = await Source.findOne({ Source: source });
    if (!sourcelead) {
      console.log(`Source with name ${source} not found, skipping lead...`);
      continue;
    }
    const sourceid = sourcelead._id;

    leadsToSave.push({
      LeadStatus: LeadStatus || "6683f48a13502fdf0ea8e5a9",
      Source: sourceid || "6683f48a13502fdf0ea8e5a9",
      Assigned: userid,
      Name: lead.full_name,
      scoreupdateby: "",
      Phone: lead.phone_number,
      AltPhone: lead.whatsapp_number,
      Address: "",
      Email: lead.email,
      typeprop: "",
      City: "",
      State: "",
      Project: "",
      Budget: lead.what_is_your_budget_,
      Country: "",
      Location: "",
      ZipCode: "",
      Priority: "",
      Type: "",
      Description: "",
      LeadType: "marketing",
      Doneby: "65cb59f9c93306341828d9eb",
      tags: dldtagId || null,
      marketingtags: marketingtagId,
      unitnumber: "",
      campagincountry: lead.country,
      campaignid: lead.campaign_id,
      adid: lead.ad_id,
    });
  }

  if (leadsToSave.length > 0) {
    // Save leads in batches of 1000 for better performance
    const batchSize = 1000;
    for (let i = 0; i < leadsToSave.length; i += batchSize) {
      const batch = leadsToSave.slice(i, i + batchSize);
      try {
        await Leads.insertMany(batch);
      } catch (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      }
    }
  }
}

function parseCSV(csvData) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { file, LeadStatus, Source } = reqBody;
    const token = request.cookies.get("token")?.value || "";
    const decoded = jwt.decode(token);
    const userIdyoken = decoded.id;
    if (!file) {
      throw new Error("No file provided");
    }

    const csvData = atob(file);
    await parseCSVAndSaveToDB(csvData, LeadStatus, userIdyoken);

    return NextResponse.json(
      { message: "CSV parsed and saved to database successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
