import axios from "axios";
import { NextResponse } from "next/server";

const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
const apiBaseUrl =
  process.env.FACEBOOK_API_BASE_URL || "https://graph.facebook.com/v20.0";

const adAccounts = ["act_3823127191257337", "act_112713589486777"];
const reportDate = "2024-08-02";

function get_country_from_campaign_name(campaign_name) {
  const lowerCaseName = campaign_name.toLowerCase();
  const patterns = {
    Pakistan: /pak(?:istan|l)?/,
    India: /india/,
    UAE: /uae/,
    Australia: /australia?/,
    Singapore: /singapore/,
    Israel: /israel/,
    France: /france/,
    Turkey: /turkey/,
    Saudi: /saudi/,
    Canada: /canada/,
    Bangladesh: /bangladesh/,
  };

  // Check each pattern
  for (const [country, pattern] of Object.entries(patterns)) {
    if (pattern.test(lowerCaseName)) {
      return country;
    }
  }

  return "Other";
}

const getInsights = async (adAccountId) => {
  const url = `${apiBaseUrl}/${adAccountId}/insights`;
  const params = {
    fields: "campaign_id,spend,actions",
    time_range: JSON.stringify({ since: reportDate, until: reportDate }),
    level: "campaign",
    access_token: accessToken,
  };
  try {
    const response = await axios.get(url, { params });
    return response.data.data;
  } catch (error) {
    console.error(
      `Error fetching insights for account ${adAccountId}:`,
      error.response?.data || error.message
    );
    return [];
  }
};

const getCampaignsAndAdsets = async (adAccountId) => {
  const url = `${apiBaseUrl}/${adAccountId}/campaigns`;
  const params = {
    fields: "id,name,daily_budget,adsets{id,daily_budget}",
    access_token: accessToken,
  };
  try {
    const response = await axios.get(url, { params });
    return response.data.data;
  } catch (error) {
    console.error(
      `Error fetching campaigns for account ${adAccountId}:`,
      error.response?.data || error.message
    );
    return [];
  }
};

const processCampaignData = async () => {
  const updates = {};
  let totalBudget = 0;
  let totalSpend = 0;
  let totalResults = 0;
  let totalCostPerResult = 0;

  for (const adAccountId of adAccounts) {
    const campaigns = await getCampaignsAndAdsets(adAccountId);
    const insights = await getInsights(adAccountId);
    const insightsMap = {};
    insights.forEach((insight) => {
      insightsMap[insight.campaign_id] = insight;
    });

    for (const campaign of campaigns) {
      const campaignId = campaign.id;
      const campaignName = campaign.name;
      let campaignDailyBudget = parseFloat(campaign.daily_budget || 0) / 100; // Converting to AED

      const country = get_country_from_campaign_name(campaignName);

      if (campaignDailyBudget === 0) {
        const adsets = campaign.adsets ? campaign.adsets.data : [];
        const adsetBudget =
          adsets.reduce(
            (sum, adset) => sum + parseFloat(adset.daily_budget || 0),
            0
          ) / 100;
        campaignDailyBudget = adsetBudget;
      }

      // Initialize spend and results
      let spend = 0;
      let results = 0;

      // Retrieve insights data
      if (insightsMap[campaignId]) {
        const insight = insightsMap[campaignId];
        spend = parseFloat(insight.spend || 0);
        const actions = insight.actions || [];
        results = actions.reduce(
          (sum, action) =>
            action.action_type === "lead" ? sum + parseInt(action.value) : sum,
          0
        );
      }

      // Calculate cost per result
      const costPerResult = results > 0 ? spend / results : 0;

      if (spend > 0) {
        // Update the campaign details
        updates[campaignName] = {
          campaignName: campaignName,
          dailyBudget: campaignDailyBudget,
          spend,
          results,
          costPerResult,
          country,
        };

        // Update the total values
        totalBudget += campaignDailyBudget;
        totalSpend += spend;
        totalResults += results;
        totalCostPerResult += costPerResult;
      }
    }
  }

  updates["Total"] = {
    dailyBudget: totalBudget,
    spend: totalSpend,
    results: totalResults,
    costPerResult: totalCostPerResult,
  };
  return updates;
};

export async function GET(request) {
  try {
    if (!accessToken) {
      throw new Error(
        "Facebook access token is not set in environment variables"
      );
    }
    const data = await processCampaignData();
    return NextResponse.json({
      message: "Results found",
      data: data,
    });
  } catch (error) {
    console.error("Error processing campaign data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
