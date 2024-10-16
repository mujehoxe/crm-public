import connect from "@/dbConfig/dbConfig";
import Comment from "@/models/Comment";
import Leads from "@/models/Leads";
import Meeting from "@/models/Meeting";
import Reminder from "@/models/Reminder";
import { NextResponse } from "next/server";

await import("@/models/Source");
await import("@/models/Status");
await import("@/models/Users");
await import("@/models/Role");
await import("@/models/Tags");
const Staff = await import("../../staff/get/route");

connect();

export async function POST(request) {
  const filters = await request.json();
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 50;
  const skip = (page - 1) * limit;

  try {
    const response = await (await Staff.GET(request)).json();
    const availableAgentsForUser = response.data.map((a) => a._id);

    let baseQuery = { Assigned: { $in: availableAgentsForUser } };

    if (filters.selectedAgents?.length > 0) {
      const joinedSelectedWithAvailable = [];
      for (const selectedAgent of filters.selectedAgents)
        for (const availableAgent of availableAgentsForUser)
          if (selectedAgent == availableAgent) {
            joinedSelectedWithAvailable.push(selectedAgent);
            break;
          }

      baseQuery.Assigned = { $in: filters.joinedSelectedWithAvailable };
    }

    if (filters.selectedStatuses?.length > 0) {
      baseQuery.LeadStatus = { $in: filters.selectedStatuses };
    }

    if (filters.selectedSources?.length > 0) {
      baseQuery.Source = { $in: filters.selectedSources };
    }

    if (filters.selectedTags.length > 0) {
      baseQuery.tags = { $in: filters.selectedTags };
    }

    if (filters.date?.length === 2) {
      try {
        const startDate = moment(filters.date[0]).startOf("day").toISOString();
        const endDate = moment(filters.date[1]).endOf("day").toISOString();

        baseQuery.timestamp = { $gte: startDate, $lt: endDate };
      } catch (error) {
        logger.error(
          `Error parsing or formatting dates: ${filters.date[0]} - ${filters.date[1]} :`,
          error
        );
      }
    }

    const searchRegex = new RegExp(filters.searchTerm, "i");
    if (filters.searchTerm && filters.searchBoxFilters.includes("LeadName")) {
      baseQuery.Name = { $regex: searchRegex };
    }

    let leadsResult = [];
    let totalLeads = 0;

    if (
      filters.searchBoxFilters.length === 0 ||
      filters.searchBoxFilters.includes("LeadName")
    ) {
      totalLeads = await Leads.countDocuments(baseQuery);
      leadsResult = await Leads.find(baseQuery)
        .populate("tags marketingtags Assigned LeadStatus Source")
        .skip(skip)
        .limit(limit);
    }

    if (filters.searchTerm) {
      let additionalLeadsIds = new Set();

      const { Name: _, ...baseQueryWithoutName } = baseQuery;

      const populatingOptions = {
        path: "Leadid",
        populate: { path: "tags marketingtags Assigned LeadStatus Source" },
        strictPopulate: false,
      };

      if (Object.keys(baseQueryWithoutName).length > 0)
        populatingOptions.match = baseQueryWithoutName;

      if (filters.searchBoxFilters.includes("Reminders")) {
        const reminders = await Reminder.find({
          Comment: searchRegex,
        }).populate(populatingOptions);
        reminders.forEach(
          (r) => r.Leadid && additionalLeadsIds.add(r.Leadid.id)
        );
      }

      if (filters.searchBoxFilters.includes("Meetings")) {
        const meetings = await Meeting.find({
          $or: [
            { Subject: searchRegex },
            { Comment: searchRegex },
            { Developer: searchRegex },
          ],
        }).populate(populatingOptions);
        meetings.forEach(
          (m) => m.Leadid && additionalLeadsIds.add(m.Leadid.id)
        );
      }

      if (filters.searchBoxFilters.includes("Comments")) {
        if (populatingOptions.path) populatingOptions.path = "LeadId";
        const comments = await Comment.find({
          Content: searchRegex,
        }).populate(populatingOptions);
        comments.forEach(
          (c) => c.LeadId && additionalLeadsIds.add(c.LeadId.id)
        );
      }

      const allLeadIds = new Set([
        ...leadsResult.map((lead) => lead.id),
        ...additionalLeadsIds,
      ]);

      const paginatedLeadIds = Array.from(allLeadIds).slice(skip, skip + limit);

      leadsResult = await Leads.find({
        _id: { $in: paginatedLeadIds },
      }).populate("tags marketingtags Assigned LeadStatus Source");

      totalLeads = allLeadIds.size;
    }

    return NextResponse.json({
      message: `Results found`,
      data: leadsResult,
      totalLeads: totalLeads,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
