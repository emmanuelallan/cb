import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import axios from "axios";

// MongoDB Atlas connection string
const mongoUri = process.env.MONGODB_URI;

// Paystack API configuration
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
const paystackBaseUrl = "https://api.paystack.co";

let client;

async function connectToDatabase() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }

  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
  }
  return client;
}

export async function POST(req) {
  try {
    const { amount, email, card } = await req.json();

    // Initialize Paystack transaction
    const initializeResponse = await axios.post(
      `${paystackBaseUrl}/transaction/initialize`,
      {
        amount: amount * 100, // Paystack expects amount in kobo
        email,
        card,
      },
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const { data } = initializeResponse.data;

    // Store payment details in MongoDB
    const dbClient = await connectToDatabase();
    const db = dbClient.db("healing-waves");
    const paymentsCollection = db.collection("donations");

    const paymentRecord = {
      amount,
      email,
      paymentMethod: "card",
      transactionReference: data.reference,
      status: "pending",
      createdAt: new Date(),
    };

    await paymentsCollection.insertOne(paymentRecord);

    return NextResponse.json({
      success: true,
      message: "Payment initialized successfully",
      data: {
        authorizationUrl: data.authorization_url,
        reference: data.reference,
      },
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing payment",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { success: false, message: "Reference is required" },
        { status: 400 },
      );
    }

    // Verify transaction status
    const verifyResponse = await axios.get(
      `${paystackBaseUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      },
    );

    const { data } = verifyResponse.data;

    // Update payment status in MongoDB
    const dbClient = await connectToDatabase();
    const db = dbClient.db("healing-waves");
    const paymentsCollection = db.collection("donations");

    await paymentsCollection.updateOne(
      { transactionReference: reference },
      {
        $set: {
          status: data.status,
          paidAt: new Date(data.paid_at),
          channel: data.channel,
          cardType: data.authorization.card_type,
          last4: data.authorization.last4,
        },
      },
    );

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      data: {
        status: data.status,
        amount: data.amount / 100, // Convert back to main currency unit
        paidAt: data.paid_at,
        channel: data.channel,
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error verifying payment",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
