"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { format } from "date-fns";

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
    accessorKey: "subscription_status",
    header: "Subscription Status",
    cell: ({ row }) => row.original.subscription_status || "N/A",
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
];
