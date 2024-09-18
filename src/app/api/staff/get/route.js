import { NextResponse } from "next/server";
import User from "@/models/Users";
import connect from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

connect();

const roleHandlers = {
  FOS: getTeamOfFos,
  ATL: getAtlAndHisStaff,
  TL: getTlAndHisStaff,
  PNL: getPnlAndHisStaff,
  BussinessHead: getBhAndHisStaff,
  Admin: getAdminAndHisStaff,
  superAdmin: getAllStaff,
};

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value || "";
    const user = jwt.decode(token);

    const handler = roleHandlers[user?.role];
    if (!handler)
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 });

    const preserveHierarchy =
      request.nextUrl.searchParams.get("preserveHierarchy") === "true";
    const results = await handler(user.id, preserveHierarchy);

    return NextResponse.json({
      message: "User found",
      data: results,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function getAllStaff(userId, preserveHierarchy) {
  return preserveHierarchy
    ? await getStaffHierarchy(userId, { PrentStaff: userId }, true)
    : await User.find().select("-password");
}

async function getStaffHierarchy(userId, nextLevelQuery, preserveHierarchy) {
  const user = await User.findById(userId).select("-password");
  if (!user) [];

  const nextLevel = await User.find(nextLevelQuery).select("-password");

  if (preserveHierarchy) {
    const subordinates = await Promise.all(
      nextLevel.map((subordinate) =>
        getStaffHierarchy(
          subordinate._id,
          { PrentStaff: subordinate._id },
          true
        )
      )
    );
    return { ...user._doc, subordinates };
  } else {
    const staff = [user];
    for (const subordinate of nextLevel) {
      const subStaff = await getStaffHierarchy(
        subordinate._id,
        { PrentStaff: subordinate._id },
        false
      );
      staff.push(...subStaff);
    }
    return staff;
  }
}

async function getAdminAndHisStaff(userId, preserveHierarchy) {
  return getStaffHierarchy(userId, { PrentStaff: userId }, preserveHierarchy);
}

async function getBhAndHisStaff(userId, preserveHierarchy) {
  return getStaffHierarchy(userId, { PrentStaff: userId }, preserveHierarchy);
}

async function getPnlAndHisStaff(userId, preserveHierarchy) {
  return getStaffHierarchy(userId, { PrentStaff: userId }, preserveHierarchy);
}

async function getTlAndHisStaff(userId, preserveHierarchy) {
  return getStaffHierarchy(userId, { PrentStaff: userId }, preserveHierarchy);
}

async function getAtlAndHisStaff(userId, preserveHierarchy) {
  const results = await User.find({
    $or: [{ _id: userId }, { PrentStaff: userId }],
  }).select("-password");

  if (preserveHierarchy) {
    const atl = results.find(
      (user) => user._id.toString() === userId.toString()
    );
    const subordinates = results.filter(
      (user) => user._id.toString() !== userId.toString()
    );
    atl.subordinates = subordinates.map((sub) => {
      sub.subordinates = [];
      return sub;
    });
    return atl;
  } else {
    const userIndex = results.findIndex(
      (user) => user._id.toString() === userId.toString()
    );

    if (userIndex !== -1) {
      const user = results.splice(userIndex, 1)[0];
      results.unshift(user);
    }

    return results;
  }
}

async function getTeamOfFos(userId, preserveHierarchy) {
  try {
    const result = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $project: { PrentStaff: 1 } },
      {
        $lookup: {
          from: "users",
          let: { parentStaffId: "$PrentStaff" },
          pipeline: [
            { $match: { $expr: { $eq: ["$PrentStaff", "$$parentStaffId"] } } },
            { $project: { password: 0 } },
          ],
          as: "usersWithSameParentStaff",
        },
      },
      { $unwind: "$usersWithSameParentStaff" },
      { $replaceRoot: { newRoot: "$usersWithSameParentStaff" } },
    ]).exec();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
