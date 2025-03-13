import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface User {
  id: string;
  created_at: string;
  email: string;
  full_name: string;
  subscription_status: string | null;
  contracts_found: number;
  alerts_set: number;
  saved_contracts: number;
  isontrial: boolean;
}

function calculateCounts(users: User[]) {
  const activeSubscriptionCount = users.filter(
    (user) => user.subscription_status === "active"
  ).length;
  const trialUsersCount = users.filter(
    (user) => user.subscription_status === "trialing"
  ).length;

  return { activeSubscriptionCount, trialUsersCount };
}

export async function GET(req: Request, res: Response) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin.rpc(
      // @ts-ignore
      "get_user_data_with_subscription_and_usage"
    );
    if (error) {
      console.error("Error fetching user data:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
    return Response.json({
      data,
      ...(data ? calculateCounts(data as unknown as User[]) : {}),
    });
  } catch (error) {
    console.error("Error finding users by IDs:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
