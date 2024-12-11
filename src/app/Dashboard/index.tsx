"use client";

import React from "react";
import { columns, User } from "./UserTable/Columns";
import { DataTable } from "./UserTable/DataTable";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import NetRevenueChart, { RevenueData } from "@/components/NetRevenueChart";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const response = await fetch("/api/user-data");
      return (await response.json()) as {
        data: User[];
        activeSubscriptionCount: number;
        trialUsersCount: number;
      };
    },
  });

  const {
    data: revenueData,
    isLoading: revenueLoading,
    error: revenueError,
  } = useQuery({
    queryKey: ["revenue-data"],
    queryFn: async () => {
      const response = await fetch("/api/revenue-data");
      return (await response.json()) as RevenueData[];
    },
  });

  if (error) {
    return <AlertDestructive />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base text-primary font-bold">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base text-primary font-bold">
              Trial Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.trialUsersCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base text-primary font-bold">
              Subscribed Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.activeSubscriptionCount}
            </div>
          </CardContent>
        </Card>
      </div>
      <Separator className="my-4" />
      <DataTable
        columns={columns}
        data={
          data ?? { data: [], activeSubscriptionCount: 0, trialUsersCount: 0 }
        }
      />
      <div className="mx-auto">
        {revenueLoading ? (
          <Skeleton className="h-[400px]" />
        ) : revenueError ? (
          <AlertDestructive />
        ) : (
          <NetRevenueChart data={revenueData ?? []} />
        )}
      </div>
    </>
  );
};

export default Dashboard;

function AlertDestructive() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong. Please try again later.
      </AlertDescription>
    </Alert>
  );
}
