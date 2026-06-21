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

// Announcement
const sendAnnouncement = inngest.createFunction(
  {
    id: "send-announcement",
    name: "Send Announcement Email",
    triggers: [
      {
        event: "announcement/send",
      },
    ],
  },
  async ({ event, step }) => {
    const { subject, message } = event.data;
    console.log("ANNOUNCEMENT FUNCTION TRIGGERED");

    // Fetch all users
    const users = await step.run("fetch-users", async () => {
      return prisma.user.findMany({
        select: {
          email: true,
          name: true,
        },
      });
    });
    if (users.length === 0) {
      console.log("No users found.");
      return {
        sent: 0,
      };
    }

    const result = await step.run("send-emails", async () => {
      const CHUNK_SIZE = 10;

      let successCount = 0;
      let failedCount = 0;

      for (let i = 0; i < users.length; i += CHUNK_SIZE) {
        const chunk = users.slice(i, i + CHUNK_SIZE);

        console.log(
          `Sending batch ${Math.floor(i / CHUNK_SIZE) + 1} (${chunk.length} emails)...`,
        );

        const results = await Promise.allSettled(
          chunk.map((user) =>
            sendEmail({
              to: user.email,
              subject,
              body: `
              <div style="
                  max-width:650px;
                  margin:auto;
                  font-family:Segoe UI,Arial,sans-serif;
                  background:#ffffff;
                  border:1px solid #e5e7eb;
                  border-radius:12px;
                  overflow:hidden;
              ">

                  <div style="
                      background:#16a34a;
                      padding:24px;
                      text-align:center;
                  ">
                      <h2 style="color:white;margin:0;">
                          📢 DailyFresh Announcement
                      </h2>
                  </div>

                  <div style="padding:30px;">

                      <p>Hello <strong>${user.name || "Customer"}</strong>,</p>

                      <h3 style="
                          color:#111827;
                          margin:20px 0 10px;
                      ">
                          ${subject}
                      </h3>

                      <div style="
                          font-size:16px;
                          line-height:1.8;
                          color:#374151;
                          white-space:pre-line;
                      ">
                          ${message}
                      </div>

                      <div style="
                          margin-top:35px;
                          padding:18px;
                          background:#f3f4f6;
                          border-radius:8px;
                      ">
                          Thank you for choosing
                          <strong> DailyFresh ❤️</strong>
                      </div>

                      <p style="
                          margin-top:25px;
                          color:#6b7280;
                          font-size:13px;
                      ">
                          This is an automated announcement from DailyFresh.
                      </p>

                  </div>

              </div>
              `,
            }),
          ),
        );

        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            successCount++;
            console.log(`Email sent to ${chunk[index].email}`);
          } else {
            failedCount++;
            console.error(
              `Failed to send email to ${chunk[index].email}`,
              result.reason,
            );
          }
        });
        console.log(`Batch ${Math.floor(i / CHUNK_SIZE) + 1} completed.`);
        if (i + CHUNK_SIZE < users.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      return {
        successCount,
        failedCount,
      };
    });

    return {
      success: true,
      totalUsers: users.length,
      sent: result.successCount,
      failed: result.failedCount,
    };
  },
);

// OTP
export const sendEmailOTP = inngest.createFunction(
  {
    id: "send-email-otp",
    name: "Send Email OTP",
    triggers: [
      {
        event: "otp/send",
      },
    ],
  },
  async ({ event, step }) => {
    const { email, name, otp } = event.data;

    await step.run("send-otp-email", async () => {
      await sendEmail({
        to: email,
        subject: "Verify your DailyFresh account",
        body: `
        <div style="
            max-width:600px;
            margin:auto;
            font-family:Segoe UI,Arial,sans-serif;
            border:1px solid #e5e7eb;
            border-radius:10px;
            overflow:hidden;
        ">

            <div style="
                background:#166534;
                color:white;
                padding:25px;
                text-align:center;
            ">
                <h2 style="margin:0;">
                    DailyFresh
                </h2>
            </div>

            <div style="padding:30px">

                <h3>Hello ${name},</h3>

                <p>
                    Use the verification code below to verify your account.
                </p>

                <div style="
                    font-size:34px;
                    font-weight:bold;
                    text-align:center;
                    letter-spacing:8px;
                    margin:30px 0;
                    color:#166534;
                ">
                    ${otp}
                </div>

                <p>
                    This OTP will expire in
                    <strong>5 minutes</strong>.
                </p>

                <p style="
                    color:#6b7280;
                    font-size:13px;
                ">
                    If you didn't request this, you can ignore this email.
                </p>

            </div>

        </div>
        `,
      });
    });

    return {
      success: true,
      email,
    };
  },
);

export const functions = [checkLowStock, sendAnnouncement, sendEmailOTP];
