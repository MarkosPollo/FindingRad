import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const apiKey = process.env.KLAVIYO_API_KEY;
    const listId = process.env.KLAVIYO_LIST_ID;

    if (!apiKey || !listId) {
      console.error("Missing KLAVIYO_API_KEY or KLAVIYO_LIST_ID");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Add profile to Klaviyo list
    const res = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        "Content-Type": "application/json",
        revision: "2024-02-15",
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            list_id: listId,
            subscriptions: [
              {
                channels: {
                  email: ["MARKETING"],
                },
                email,
              },
            ],
          },
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Klaviyo error:", errText);
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
