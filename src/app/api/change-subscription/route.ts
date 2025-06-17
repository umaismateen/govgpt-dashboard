import { getServerSession } from "next-auth/next";
import { authOptions, getIsEnterprise } from "../lib";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS = {
  standard_monthly_new: "price_1R43fqP9XbxRxhZw2HbQ4D5e", // new customers monthly
  standard_yearly_new: "price_1R43fqP9XbxRxhZwPIF8Cpx0", // new customers yearly
  standard_monthly_existing: "price_1QpYt1RwNg4vrfp4PISlD6Vc", // existing customers monthly
  standard_yearly_existing: "price_1QpZ6KRwNg4vrfp4PjNkyXDB", // existing customers yearly

  enterprise_monthly: "price_1QpZ6lRwNg4vrfp4NEkHzxhG", // Pro monthly
  enterprise_yearly: "price_1QpZ7QRwNg4vrfp4OnwkJWp5", // Pro yearly
} as const;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY not found in environment variables");
      return NextResponse.json(
        { error: "Server configuration error - missing Stripe key" },
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { userId, planId, planType, action } = await req.json();

    if (action === "cancel") {
      if (!userId) {
        return NextResponse.json(
          { error: "Missing userId for cancellation" },
          { status: 400 }
        );
      }

      const { data: subscriptions, error: subError } = await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .single();

      if (subError || !subscriptions) {
        console.error(
          "Error fetching subscription for cancellation:",
          subError
        );
        return NextResponse.json(
          {
            error: "No active subscription found",
            details:
              subError?.message || "User has no active subscription to cancel",
          },
          { status: 404 }
        );
      }

      try {
        const { error: updateError } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("id", subscriptions.id);

        if (updateError) {
          console.error(
            "Error updating canceled subscription in Supabase:",
            updateError
          );
          throw new Error(
            `Failed to update subscription status in database: ${updateError.message}`
          );
        }

        return NextResponse.json({
          success: true,
          message: "Subscription cancelled successfully",
          subscription: {
            id: subscriptions.id,
            status: "canceled",
            canceled_at: new Date().toISOString(),
          },
        });
      } catch (error: any) {
        console.error("Error during subscription cancellation:", error);
        return NextResponse.json(
          {
            error: "Failed to cancel subscription",
            details: error.message || "Unknown error",
          },
          { status: 500 }
        );
      }
    }

    if (!userId || !planId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Map the plan selection to the correct price ID
    let actualPriceId: string;

    if (planId === "standard_monthly_new") {
      actualPriceId = PRICE_IDS.standard_monthly_new;
    } else if (planId === "standard_yearly_new") {
      actualPriceId = PRICE_IDS.standard_yearly_new;
    } else if (planId === "standard_monthly_existing") {
      actualPriceId = PRICE_IDS.standard_monthly_existing;
    } else if (planId === "standard_yearly_existing") {
      actualPriceId = PRICE_IDS.standard_yearly_existing;
    } else if (planId === "enterprise_monthly") {
      actualPriceId = PRICE_IDS.enterprise_monthly;
    } else if (planId === "enterprise_yearly") {
      actualPriceId = PRICE_IDS.enterprise_yearly;
    } else {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
    }

    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created", { ascending: false })
      .limit(1)
      .single();

    if (subError && subError.code !== "PGRST116") {
      console.error("Error fetching subscription:", subError);
      return NextResponse.json(
        {
          error: "Failed to fetch current subscription",
          details: subError.message,
        },
        { status: 500 }
      );
    }

    let result;

    if (subscriptions) {
      if (subscriptions.status === "active") {
        try {
          const { error: updateError } = await supabaseAdmin
            .from("subscriptions")
            .update({
              price_id: actualPriceId,
              status: "active",
            })
            .eq("id", subscriptions.id);

          if (updateError) {
            console.error(
              "Error updating subscription in Supabase:",
              updateError
            );
            throw new Error(
              `Failed to update subscription in database: ${updateError.message}`
            );
          }

          result = {
            id: subscriptions.id,
            status: "active",
            price_id: actualPriceId,
          };
        } catch (error: any) {
          console.error("Error during subscription update:", error);
          throw new Error(
            `Database error: ${error.message || "Unknown error"}`
          );
        }
      } else if (subscriptions.status === "canceled") {
        try {
          const { error: updateError } = await supabaseAdmin
            .from("subscriptions")
            .update({
              status: "active",
              price_id: actualPriceId,
              canceled_at: null,
            })
            .eq("id", subscriptions.id);

          if (updateError) {
            console.error(
              "Error updating reactivated subscription in Supabase:",
              updateError
            );
            throw new Error(
              `Failed to update subscription in database: ${updateError.message}`
            );
          }

          result = {
            id: subscriptions.id,
            status: "active",
            price_id: actualPriceId,
          };
        } catch (error: any) {
          console.error("Error during subscription reactivation:", error);
          throw new Error(
            `Database error: ${error.message || "Unknown error"}`
          );
        }
      } else {
        try {
          const { error: updateError } = await supabaseAdmin
            .from("subscriptions")
            .update({
              price_id: actualPriceId,
              status: "active",
            })
            .eq("id", subscriptions.id);

          if (updateError) {
            throw new Error(
              `Failed to update subscription in database: ${updateError.message}`
            );
          }

          result = {
            id: subscriptions.id,
            status: "active",
            price_id: actualPriceId,
          };
        } catch (error: any) {
          console.error("Error during subscription update:", error);
          throw new Error(
            `Database error: ${error.message || "Unknown error"}`
          );
        }
      }
    } else {
      try {
        const newSubscriptionId = `sub_db_${userId}_${Date.now()}`;

        const { error: insertError } = await supabaseAdmin
          .from("subscriptions")
          .insert({
            id: newSubscriptionId,
            user_id: userId,
            status: "active",
            price_id: actualPriceId,
            current_period_start: new Date().toISOString(),
            created: new Date().toISOString(),
          });

        if (insertError) {
          console.error(
            "Error inserting subscription in Supabase:",
            insertError
          );
          throw new Error(
            `Failed to save subscription to database: ${insertError.message}`
          );
        }

        result = {
          id: newSubscriptionId,
          status: "active",
          price_id: actualPriceId,
        };
      } catch (error: any) {
        console.error("Error during subscription creation:", error);
        throw new Error(`Database error: ${error.message || "Unknown error"}`);
      }
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: result.id,
        status: result.status,
        price_id: actualPriceId,
      },
    });
  } catch (error: any) {
    console.error("Error changing subscription:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message || "Unknown error occurred",
        errorType: error.constructor.name,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      plans: [
        {
          id: "standard_monthly_new",
          name: "Basic Monthly",
          priceId: PRICE_IDS.standard_monthly_new,
          type: "standard",
          billing: "monthly",
          price: "$149",
          description:
            "Cost-effective solution that balances advanced features with affordability, making it ideal for small scale operations.",
        },
        {
          id: "standard_yearly_new",
          name: "Basic Yearly",
          priceId: PRICE_IDS.standard_yearly_new,
          type: "standard",
          billing: "yearly",
          price: "$119",
          description: "Basic features with yearly billing (Save 20%)",
        },
        {
          id: "enterprise_monthly",
          name: "Pro Monthly",
          priceId: PRICE_IDS.enterprise_monthly,
          type: "enterprise",
          billing: "monthly",
          price: "Contact Us",
          description:
            "Medium-sized to large businesses that need comprehensive features and seamless integration with their existing systems.",
        },
        {
          id: "enterprise_yearly",
          name: "Pro Yearly",
          priceId: PRICE_IDS.enterprise_yearly,
          type: "enterprise",
          billing: "yearly",
          price: "Contact Us",
          description: "Pro features with yearly billing",
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
