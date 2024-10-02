import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request) {
  try {
    const { oneSignalUserId } = req.body;

    const result = await db
      .collection("users")
      .updateOne(
        { email: userEmail },
        { $set: { oneSignalUserId: oneSignalUserId } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "OneSignal User ID updated successfully" });
  } catch (error) {
    console.error("Error updating OneSignal User ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
