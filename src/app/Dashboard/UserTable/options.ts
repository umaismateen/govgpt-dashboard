import {
  CircleCheck,
  Circle,
  XCircle,
  PauseCircle,
  AlertTriangle,
  CheckCircle,
  Slash,
} from "lucide-react";

export const trialOptions = [
  { label: "Yes", value: true, icon: CircleCheck },
  { label: "No", value: false, icon: Circle },
];

export const subscribedOptions = [
  { label: "Yes", value: "Yes", icon: CircleCheck },
  { label: "No", value: "No", icon: Circle },
];

export const statusOptions = [
  { label: "Active", value: "active", icon: CheckCircle }, // Positive, active status
  // { label: "Trialing", value: "trialing", icon: PauseCircle }, // Paused status can represent trial
  { label: "Paused", value: "paused", icon: PauseCircle }, // Paused status
  { label: "Canceled", value: "canceled", icon: XCircle }, // Canceled status
  { label: "Incomplete", value: "incomplete", icon: AlertTriangle }, // Incomplete or missing information
  {
    label: "Incomplete Expired",
    value: "incomplete_expired",
    icon: AlertTriangle,
  }, // Expired or incomplete status
  { label: "Past Due", value: "past_due", icon: AlertTriangle }, // Attention needed
  { label: "Unpaid", value: "unpaid", icon: AlertTriangle }, // Attention needed
];
