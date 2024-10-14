import connect from "@/dbConfig/dbConfig";
import Leads from "@/models/Leads";
import logger from "@/utils/logger";
import moment from "moment";
import { NextResponse } from "next/server";

connect();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const searchterm = searchParams.get("searchterm") || "";
    const selectedAgentsString = searchParams.get("selectedAgents") || "";
    const selectedSourcesString = searchParams.get("selectedStatuses") || "";
    const selectedStatusesString = searchParams.get("selectedSources") || "";
    const selectedTagsString = searchParams.get("selectedTags") || "";
    const dateString = searchParams.get("date") || "";
    const skip = (page - 1) * limit;

    const selectedAgents = selectedAgentsString.split(",").filter(Boolean);
    const selectedStatuses = selectedSourcesString.split(",").filter(Boolean);
    const selectedSources = selectedStatusesString.split(",").filter(Boolean);
    const selectedTags = selectedTagsString.split(",").filter(Boolean);

    let query = {};

    if (searchterm) {
      let searchConditions;

      if (isNaN(searchterm)) {
        searchConditions = [{ Name: { $regex: searchterm, $options: "i" } }];
      } else {
        searchConditions = [{ Phone: searchterm }];
      }

      query.$or = searchConditions;
    }

    if (selectedAgents.length > 0) query.Assigned = { $in: selectedAgents };

    if (selectedStatuses.length > 0)
      query.LeadStatus = { $in: selectedStatuses };

    if (selectedSources.length > 0) query.Source = { $in: selectedSources };

    if (selectedTags.length > 0) query.tags = { $in: selectedTags };

    if (dateString != "" && dateString != ",") {
      const dates = dateString.split(",");

      if (dates.length === 2) {
        try {
          const startDate = moment(dates[0]).startOf("day").toISOString();
          const endDate = moment(dates[1]).endOf("day").toISOString();

          query.timestamp = { $gte: startDate, $lt: endDate };
        } catch (error) {
          logger.error(
            `Error parsing or formatting dates: ${dates[0]} - ${dates[1]} :`,
            error
          );
        }
      } else {
        logger.info(`Invalid date range format: ${dateString}`);
      }
    }

    const leadsQuery = Leads.find(query)
      .populate("tags marketingtags Assigned LeadStatus Source")
      .skip(skip)
      .limit(limit);

    const [leads, totalLeads] = await Promise.all([
      leadsQuery.exec(),
      Leads.countDocuments(query),
    ]);

    return NextResponse.json({
      message: "Leads found",
      data: leads,
      dateString: dateString,
      totalLeads: totalLeads,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
