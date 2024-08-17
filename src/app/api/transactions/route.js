import { NextResponse } from "next/server";
import Donation from "@/models/donation";
import Goal from "@/models/goal";
import { Resend } from "resend";
import connectDB from "@/lib/mongodb";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  await connectDB();
  try {
    const transactionData = await request.json();

    // Validate the transaction data
    if (
      !transactionData.amount ||
      !transactionData.transactionId ||
      !transactionData.email
    ) {
      return NextResponse.json(
        { error: "Invalid transaction data" },
        { status: 400 },
      );
    }

    // Prepare the data for insertion
    const donationData = {
      name: transactionData.name || "",
      email: transactionData.email,
      message: transactionData.message || "",
      amount: transactionData.amount,
      chaiCount: transactionData.chaiCount,
      isPrivate: transactionData.isPrivate || false,
      paypalEmail: transactionData.paypalEmail,
      transactionId: transactionData.transactionId,
      paymentMethod: transactionData.paymentMethod,
    };

    // Insert the transaction into the database
    const donation = new Donation(donationData);
    const result = await donation.save();

    // Update the current amount in the goal collection
    const updateResult = await Goal.updateOne(
      {}, // Assuming there's only one document in the goal collection
      { $inc: { current: transactionData.amount } },
      { upsert: true },
    );

    if (!updateResult.modifiedCount && !updateResult.upsertedCount) {
      console.warn("Failed to update current amount in goal collection");
    }

    // Send thank you email
    const emailResult = await resend.emails.send({
      from: "Emmanuel Allan <noreply@remotask.org>",
      to: transactionData.email,
      subject: "Thank you for your support!",
      html: `<p>Dear ${transactionData.name || "Supporter"},</p>
             <p>Thank you for your support of $${transactionData.amount} (${transactionData.chaiCount} chai). We truly appreciate your generosity!</p>
             ${transactionData.message ? `<p>Your message: "${transactionData.message}"</p>` : ""}
             <p>Transaction ID: ${transactionData.transactionId}</p>
             <p>Best regards,<br>Emmanuel Allan</p>`,
    });

    if (!emailResult || emailResult.error) {
      console.error("Failed to send email:", emailResult?.error);
    }

    return NextResponse.json(
      { success: true, insertedId: result._id },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
