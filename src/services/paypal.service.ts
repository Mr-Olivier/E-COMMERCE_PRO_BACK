import checkoutSDK from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";

dotenv.config();

// Set up PayPal environment
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID || "";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";

  // Use sandbox for development, live for production
  if (process.env.NODE_ENV === "production") {
    return new checkoutSDK.core.LiveEnvironment(clientId, clientSecret);
  }
  return new checkoutSDK.core.SandboxEnvironment(clientId, clientSecret);
}

// Create PayPal client
const client = new checkoutSDK.core.PayPalHttpClient(environment());

// Create PayPal order
export const createPayPalOrder = async (
  amount: number,
  currency: string = "USD",
  orderReference: string
) => {
  try {
    const request = new checkoutSDK.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
          reference_id: orderReference,
        },
      ],
      application_context: {
        return_url: `${
          process.env.CLIENT_URL || "http://localhost:3000"
        }/checkout/success`,
        cancel_url: `${
          process.env.CLIENT_URL || "http://localhost:3000"
        }/checkout/cancel`,
      },
    });

    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    throw error;
  }
};

// Capture PayPal payment (finalize the payment)
export const capturePayPalPayment = async (orderId: string) => {
  try {
    const request = new checkoutSDK.orders.OrdersCaptureRequest(orderId);
    request.prefer("return=representation");
    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    throw error;
  }
};

// Verify PayPal order
export const verifyPayPalOrder = async (orderId: string) => {
  try {
    const request = new checkoutSDK.orders.OrdersGetRequest(orderId);
    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error("Error verifying PayPal order:", error);
    throw error;
  }
};

export default {
  createPayPalOrder,
  capturePayPalPayment,
  verifyPayPalOrder,
};
