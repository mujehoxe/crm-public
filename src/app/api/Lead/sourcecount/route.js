import connect from "@/dbConfig/dbConfig";
import Leads from "@/models/Leads";
import SourceModel from "@/models/Source";
import { NextResponse } from "next/server";

connect();

export async function GET(request) {
  try {
    let Source = request.nextUrl.searchParams.get("Source");

    const SourceDocument = await SourceModel.findById(Source);
    if (!SourceDocument) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    const leadsCount = await Leads.countDocuments({
      Source: SourceDocument._id,
    });
    return NextResponse.json({
      message: `Leads count for source ${Source}`,
      count: leadsCount,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
