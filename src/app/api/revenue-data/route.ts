import { NextResponse } from "next/server";
import Stripe from "stripe";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    // Calculate timestamps for the last 12 months
    const now = Math.floor(Date.now() / 1000);
    const twelveMonthsAgo = now - 365 * 24 * 60 * 60;

    // Fetch charges in a single API call with more comprehensive filtering
    const { data: charges } = await stripe.charges.list({
      created: {
        gte: twelveMonthsAgo,
        lte: now,
      },
      limit: 100,
      expand: ["data.balance_transaction"],
    } as Stripe.ChargeListParams);

    // Aggregate monthly volumes directly from the fetched charges
    const monthlyVolumes: Record<
      string,
      { monthTimestamp: number; netVolume: number }
    > = {};

    charges.forEach((charge) => {
      // Type assertion for expanded balance transaction
      const balanceTransaction =
        charge.balance_transaction as Stripe.BalanceTransaction;

      if (balanceTransaction) {
        const date = new Date(balanceTransaction.created * 1000);
        const monthKey = format(date, "MMM yyyy"); // e.g. "Aug 2025"

        const monthTimestamp = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        ).getTime();

        monthlyVolumes[monthKey] = {
          monthTimestamp,
          netVolume: charge.refunded
            ? Number(
                (
                  (monthlyVolumes[monthKey]?.netVolume || 0) -
                  balanceTransaction.fee / 100
                ).toFixed(2)
              )
            : Number(
                (
                  (monthlyVolumes[monthKey]?.netVolume || 0) +
                  balanceTransaction.net / 100
                ).toFixed(2)
              ),
        };
      }
    });

    // Sort and format the response
    const responseData = Object.keys(monthlyVolumes)
      .sort(
        (a, b) =>
          monthlyVolumes[a].monthTimestamp - monthlyVolumes[b].monthTimestamp
      )
      .map((month) => ({
        month,
        netVolume: monthlyVolumes[month].netVolume,
      }));

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching monthly net volume:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// [{"month":"2024-05","netVolume":29008},{"month":"2024-06","netVolume":29008},{"month":"2024-07","netVolume":175829},{"month":"2024-08","netVolume":14504},{"month":"2024-09","netVolume":21756},{"month":"2024-10","netVolume":72520},{"month":"2024-11","netVolume":123240},{"month":"2024-12","netVolume":47944}]
