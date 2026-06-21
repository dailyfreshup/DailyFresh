import { Inngest } from "inngest";
import { prisma } from "../config/prisma.js";
import sendEmail from "../config/nodemailer.js";

const LOW_STOCK_THRESHOLD = Number(process.env.LOW_STOCK_THRESHOLD || 10);

// Create Inngest client
export const inngest = new Inngest({
  id: "DailyFresh",
});

// Low Stock Alert
const checkLowStock = inngest.createFunction(
  {
    id: "check-low-stock",
    name: "Low Stock Alert",
    triggers: [
      {
        event: "inventory/stock.updated",
      },
    ],
  },
  async ({ event, step }) => {
    console.log("=================================");
    console.log("Low Stock Function Triggered");
    console.log("Event:", event);

    const { productId } = event.data;

    const product = await step.run("fetch-product", async () => {
      return prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
    });

    console.log("Product:", product);

    if (!product) {
      console.log("Product not found");
      return;
    }

    console.log(
      `Current Stock: ${product.stock}, Threshold: ${LOW_STOCK_THRESHOLD}`,
    );

    if (product.stock === null || product.stock >= LOW_STOCK_THRESHOLD) {
      console.log("Stock is above threshold. Email skipped.");
      return;
    }

    await step.run("send-low-stock-email", async () => {
      const adminEmails = process.env.ADMIN_EMAILS
        ? process.env.ADMIN_EMAILS.split(",").map((email) => email.trim())
        : [];

      console.log("Admin Emails:", adminEmails);

      if (adminEmails.length === 0) {
        console.log("No admin emails configured.");
        return;
      }

      console.log("Sending Low Stock Email...");

      await sendEmail({
        to: adminEmails.join(","),
        subject: `Low Stock Alert: ${product.name}`,
        body: `
        <div style="font-family:Segoe UI,Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:12px;overflow:hidden;">
        
            <div style="background:#dc2626;padding:20px;text-align:center;">
                <h2 style="color:white;margin:0;">
                    Low Stock Alert
                </h2>
            </div>

            <div style="padding:20px;">

                ${
                  product.image
                    ? `
                    <div style="text-align:center;">
                        <img
                            src="${product.image}"
                            width="120"
                            style="border-radius:10px;"
                        />
                    </div>
                `
                    : ""
                }

                <h3>${product.name}</h3>

                <p>
                    <strong>Category:</strong> ${product.category}
                </p>

                <p>
                    <strong>Unit:</strong> ${product.unit}
                </p>

                <p
                    style="
                        color:red;
                        font-size:24px;
                        font-weight:bold;
                    "
                >
                    Remaining Stock: ${product.stock}
                </p>

                <p>
                    Please restock this product immediately.
                </p>

            </div>

        </div>
        `,
      });

      console.log("Low Stock Email Sent Successfully");
    });

    return {
      success: true,
      product: product.name,
      stock: product.stock,
    };
  },
);

export const functions = [checkLowStock];
