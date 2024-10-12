import connect from "@/dbConfig/dbConfig";
import Invoice from "@/models/invoice";
import fs from "fs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import path from "path";

connect();

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const username = decoded.name;
    const reqBody = await request.json();
    const uploadsDir = path.join(process.cwd(), "public", "kyc");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const savedFileNames = [];
    const otherFileNames = [];
    const buyerImagesArrayFileNames = [];

    const buyerImages1Array = reqBody.buyerImages1Base64?.buyerImages1 || [];
    buyerImages1Array.forEach((buyerImageBase64, index) => {
      if (buyerImageBase64 && typeof buyerImageBase64 === "string") {
        let base64Data;
        let fileExtension;

        if (buyerImageBase64.startsWith("data:application/pdf;base64,")) {
          base64Data = buyerImageBase64.replace(
            /^data:application\/pdf;base64,/,
            ""
          );
          fileExtension = "pdf";
        } else if (buyerImageBase64.startsWith("data:image/jpeg;base64,")) {
          base64Data = buyerImageBase64.replace(
            /^data:image\/jpeg;base64,/,
            ""
          );
          fileExtension = "jpg";
        } else if (buyerImageBase64.startsWith("data:image/png;base64,")) {
          base64Data = buyerImageBase64.replace(/^data:image\/png;base64,/, "");
          fileExtension = "png";
        } else {
          console.error(
            `Unsupported file type for buyer image at index ${index}`
          );
          return; // Skip unsupported file type
        }

        const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
        const buyerImagePath = path.join(
          uploadsDir,
          `fixed_${uniqueNumber}_buyerImages${index + 1}.${fileExtension}`
        );

        try {
          fs.writeFileSync(buyerImagePath, base64Data, "base64");
          savedFileNames.push(buyerImagePath);
        } catch (error) {
          console.error(
            `Error saving file ${buyerImagePath}: ${error.message}`
          );
          throw error;
        }
      }
    });

    const OtherImageArray = reqBody.buyerImages1Base64?.OtherImage || [];
    OtherImageArray.forEach((OtherImageBase64, index) => {
      if (OtherImageBase64 && typeof OtherImageBase64 === "string") {
        const base64Data = OtherImageBase64.replace(
          /^data:application\/pdf;base64,/,
          ""
        );
        const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
        const otherImagePath = path.join(
          uploadsDir,
          `eoi_${uniqueNumber}_otherImages${index + 1}.pdf`
        );

        try {
          fs.writeFileSync(otherImagePath, base64Data, "base64");
          otherFileNames.push(otherImagePath);
        } catch (error) {
          console.error(
            `Error saving file ${otherImagePath}: ${error.message}`
          );
          throw error;
        }
      }
    });

    const buyerImagesArray = reqBody.buyerImages1Base64?.buyerImages || [];
    buyerImagesArray.forEach((buyerImagesBase64, index) => {
      if (buyerImagesBase64 && typeof buyerImagesBase64 === "string") {
        let base64Data;
        let fileExtension;

        if (buyerImagesBase64.startsWith("data:application/pdf;base64,")) {
          base64Data = buyerImagesBase64.replace(
            /^data:application\/pdf;base64,/,
            ""
          );
          fileExtension = "pdf";
        } else if (buyerImagesBase64.startsWith("data:image/jpeg;base64,")) {
          base64Data = buyerImagesBase64.replace(
            /^data:image\/jpeg;base64,/,
            ""
          );
          fileExtension = "jpg";
        } else if (buyerImagesBase64.startsWith("data:image/png;base64,")) {
          base64Data = buyerImagesBase64.replace(
            /^data:image\/png;base64,/,
            ""
          );
          fileExtension = "png";
        } else {
          console.error(
            `Unsupported file type for buyer image at index ${index}`
          );
          return; // Skip unsupported file type
        }

        const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
        const buyerImagesPath = path.join(
          uploadsDir,
          `multiple_${uniqueNumber}_buyer${index + 1}.${fileExtension}`
        );

        try {
          fs.writeFileSync(buyerImagesPath, base64Data, "base64");
          buyerImagesArrayFileNames.push(buyerImagesPath);
        } catch (error) {
          console.error(
            `Error saving file ${buyerImagesPath}: ${error.message}`
          );
          throw error;
        }
      }
    });

    const buyerOneData = reqBody.data.buyerOneData;

    const tempAddedBuyerData = reqBody.data.tempAddedBuyerData || [];
    let additionalBuyers = [];

    if (tempAddedBuyerData.length > 0) {
      additionalBuyers = tempAddedBuyerData.map((buyer) => ({
        name: buyer?.name || "",
        email: buyer?.Email || "",
        contact: buyer?.Contact || "",
        dob: buyer?.dob || "",
        passport: buyer?.passport || "",
        passportFront: savedFileNames.length > 0 ? savedFileNames[0] : null,
        passportBack: savedFileNames.length > 1 ? savedFileNames[1] : null,
        expiry: buyer?.expiry || "",
        nationality: buyer?.nationality || "",
        resident: buyer?.Resident || "",
        emiratesid: buyer?.emiratesid || "",
        emiratesExpiry: buyer?.emiratesExpiry || "",
        emiratesPhoto: savedFileNames.length > 2 ? savedFileNames[2] : null,
        address: buyer?.address || "",
      }));
    }

    const newInvoice = new Invoice({
      Userid: userId,
      buyer: {
        name: buyerOneData.name || buyerOneData[0].name,
        email: buyerOneData.Email || buyerOneData[0].Email,
        contact: buyerOneData.Contact || buyerOneData[0].Contact,
        dob: buyerOneData.dob || buyerOneData[0].dob,
        passport: buyerOneData.passport || buyerOneData[0].passport,
        passportExpiry: buyerOneData.expiry || buyerOneData[0].expiry,
        passfront: savedFileNames.length > 0 ? savedFileNames[0] : null,
        passback: savedFileNames.length > 1 ? savedFileNames[1] : null,
        nationality: buyerOneData.nationality || buyerOneData[0].nationality,
        resident: buyerOneData.Resident || buyerOneData[0].Resident,
        emiratesid: buyerOneData.emiratesid || buyerOneData[0].emiratesid,
        emiratesExpiry:
          buyerOneData.emiratesExpiry || buyerOneData[0].emiratesExpiry,
        emiratesPhoto: savedFileNames.length > 3 ? savedFileNames[3] : null,
        address: buyerOneData.address || buyerOneData[0].address,
      },
      EOI: buyerOneData.tokenDate,
      Leadid: buyerOneData.leadId || buyerOneData[0].leadId,
      Closure: buyerOneData.closureDate,
      Booking: buyerOneData.bookingDate,
      Handover: buyerOneData.handoverDate,
      Property: buyerOneData.propertyType,
      Ready: buyerOneData.Ready,
      Developer: buyerOneData.developer,
      Bed: buyerOneData.Bed,
      BUA: buyerOneData.BUA,
      ProjectName: buyerOneData.ProjectName,
      PlotArea: buyerOneData.PlotArea,
      PlotNumber: buyerOneData.PlotNumber,
      Unitaddress: buyerOneData.Unitaddress,
      Price: buyerOneData.Price,
      type: buyerOneData.radioBtnStatus,
      Comission: buyerOneData.Comission,
      SpotCash: buyerOneData.spotCash,
      ComissionType: buyerOneData.commisionttype,
      TotalComission: buyerOneData.netcom,
      VAT: buyerOneData.VAT,
      ComissionVAT: buyerOneData.TotalComission,
      othrDeveloper: buyerOneData.otherDeveloper,
      External: buyerOneData.External,
      tokenDate: buyerOneData.tokenDate,
      closureDate: buyerOneData.closureDate,
      bookingDate: buyerOneData.bookingDate,
      handoverDate: buyerOneData.handoverDate,
      otherDeveloper: buyerOneData.otherDeveloper,
      commisionttype: buyerOneData.commisionttype,
      netcom: buyerOneData.netcom,
      grandTotalCommission: buyerOneData.grandTotalCommission,
      loyaltyBonus: buyerOneData.loyaltyBonus,
      additionalBuyers,
      submittedBy: userId,
      visaphoto: savedFileNames.length > 2 ? savedFileNames[2] : null,
      buyerImages: buyerImagesArrayFileNames,
      eoiimage: otherFileNames.length > 0 ? otherFileNames[0] : null,
      bookingmage: otherFileNames.length > 1 ? otherFileNames[1] : null,
      SPAmage: otherFileNames.length > 2 ? otherFileNames[2] : null,
    });

    const savedInvoice = await newInvoice.save();

    return NextResponse.json({
      message: "Invoice created successfully",
      success: true,
      savedInvoice,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
