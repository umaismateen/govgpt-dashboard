import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
    (user) => user.isontrial === true
  ).length;

  return { activeSubscriptionCount, trialUsersCount };
}

export const runtime = "edge";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data, error } = await supabaseAdmin.rpc(
    // @ts-ignore
    "get_user_data_with_subscription_and_usage"
  );

  try {
    return Response.json({
      data,
      ...(data ? calculateCounts(data as unknown as User[]) : {}),
    });
  } catch (error) {
    console.error("Error finding users by IDs:", error);
  } finally {
  }
}
