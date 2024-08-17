import axios, { AxiosHeaders as Buffer } from "axios";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

async function getPayPalAccessToken() {
  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data.access_token;
}

async function createPayPalOrder(amount) {
  const accessToken = await getPayPalAccessToken();

  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paypal/capture`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancelled`,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
}

async function capturePayPalPayment(orderId) {
  const accessToken = await getPayPalAccessToken();

  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
}

async function getPayPalOrderDetails(orderId) {
  const accessToken = await getPayPalAccessToken();

  const response = await axios.get(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
}

async function saveTransactionToDatabase(transaction) {
  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection("transactions");

    await collection.insertOne(transaction);
  } finally {
    await client.close();
  }
}

export async function POST(req) {
  const { email, amount, paypalEmail } = await req.json();

  try {
    const order = await createPayPalOrder(amount);

    // Return the PayPal approval URL
    const approvalUrl = order.links.find((link) => link.rel === "approve").href;

    return NextResponse.json({ approvalUrl });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      { error: "Error creating PayPal order" },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("token");

  try {
    const captureResult = await capturePayPalPayment(orderId);
    const orderDetails = await getPayPalOrderDetails(orderId);

    // Extract necessary details for saving
    const transaction = {
      transactionId: orderDetails.id,
      paypalEmail: orderDetails.payer.email_address,
      amount: orderDetails.purchase_units[0].amount.value,
      currency: orderDetails.purchase_units[0].amount.currency_code,
      status: captureResult.status,
      createTime: orderDetails.create_time,
      updateTime: orderDetails.update_time,
    };

    // Save transaction to MongoDB
    await saveTransactionToDatabase(transaction);

    // Redirect the user to a success page with order details
    return NextResponse.redirect(
      `/payment-success?orderId=${orderDetails.id}&status=${orderDetails.status}`,
    );
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    return NextResponse.redirect("/payment-failed");
  }
}
