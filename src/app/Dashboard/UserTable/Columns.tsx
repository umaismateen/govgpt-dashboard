"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { format } from "date-fns";
import { getIsEnterprise } from "@/app/api/lib";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import SubscriptionChangeDialog from "@/components/SubscriptionChangeDialog";

const UserActionsCell = ({ user }: { user: User }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const currentPlan = user?.price_id
    ? getIsEnterprise(user.price_id)
      ? "Pro"
      : "Basic"
    : "No Plan";

  const handleOpenDialog = () => {
    console.log(`Opening subscription change dialog for user: ${user.email}`);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpenDialog}
        className="h-8"
        title={`Change subscription plan for ${user.email}`}
      >
        <Settings className="w-4 h-4 mr-1" />
        Change Plan
      </Button>

      <SubscriptionChangeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        userId={user.id}
        currentPlan={currentPlan}
        userEmail={user.email}
      />
    </>
  );
};

export interface User {
  id: string;
  created_at: string;
  email: string;
  full_name: string;
  subscription_status: string | null;
  contracts_found: number;
  alerts_set: number;
  saved_contracts: number;
  isontrial: boolean;
  phone_number?: string;
  price_id?: string;
  cancel_at_period_end?: boolean;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Phone Number" />;
    },
    filterFn: (row, id, value) => {
      return value.includes(!!row.original.phone_number);
    },
  },
  {
    accessorKey: "isontrial",
    header: "Is On Trial",
    cell: ({ row }) => (row.original.isontrial ? "Yes" : "No"),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "subscribed",
    header: "Subscribed",
    cell: ({ row }) =>
      row.original?.subscription_status === "active" ? "Yes" : "No",
    filterFn: (row, id, value) => {
      return value.includes(
        row.original.subscription_status === "active" ? "Yes" : "No"
      );
    },
  },
  {
    accessorKey: "subscription_plan",
    header: "Subscription Plan",
    cell: ({ row }) =>
      row.original?.price_id
        ? getIsEnterprise(row.original?.price_id || "")
          ? "Pro"
          : "Basic"
        : "N/A",
    filterFn: (row, id, value) => {
      return value.includes(
        row.original?.price_id
          ? getIsEnterprise(row.original?.price_id || "")
            ? "Pro"
            : "Basic"
          : false
      );
    },
  },
  {
    accessorKey: "subscription_status",
    header: "Subscription Status",
    cell: ({ row }) => row.original.subscription_status || "N/A",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "cancel_at_period_end",
    header: "Cancel at Period End",
    cell: ({ row }) => (row.original.cancel_at_period_end ? "Yes" : "No"),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "saved_contracts",
    header: "Saved Contracts",
  },
  {
    accessorKey: "contracts_found",
    header: "Contracts Found",
  },
  {
    accessorKey: "alerts_set",
    header: "Smart Alerts Set",
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Date Created" />;
    },
    enableGlobalFilter: false, // disable global filtering for this column
    cell: ({ row }) => format(row.original.created_at, "do MMMM, yyyy"),
    filterFn: (row, id, value) => {
      // Ensure value is an object with 'from' and 'to' properties that are valid dates
      const { from, to } = value || {};
      if (
        (from && isNaN(new Date(from).getTime())) ||
        (to && isNaN(new Date(to).getTime()))
      )
        return true;

      // Parse row date and validate
      const rowDate = new Date(row.getValue(id));
      if (isNaN(rowDate.getTime())) return false; // Return false if row date is invalid

      // Apply filters based on presence of 'from' and 'to' values
      return (
        (!from || rowDate >= new Date(from)) && (!to || rowDate <= new Date(to))
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];
