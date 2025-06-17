"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Crown, Zap, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  priceId: string;
  type: string;
  billing: string;
  description: string;
}

interface SubscriptionChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentPlan?: string;
  userEmail: string;
}

const SubscriptionChangeDialog: React.FC<SubscriptionChangeDialogProps> = ({
  isOpen,
  onClose,
  userId,
  currentPlan,
  userEmail,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const queryClient = useQueryClient();

  // Fetch available plans
  const {
    data: plansData,
    isLoading: plansLoading,
    error: plansError,
  } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const response = await fetch("/api/change-subscription");
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized - Admin access required");
        }
        throw new Error("Failed to fetch plans");
      }
      return response.json();
    },
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message.includes("Unauthorized")) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Mutation for changing subscription
  const changeSubscriptionMutation = useMutation({
    mutationFn: async (data: {
      userId: string;
      planId: string;
      planType: string;
    }) => {
      const response = await fetch("/api/change-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          throw new Error("Unauthorized - Admin access required");
        }
        if (error.requiresCustomerSetup) {
          throw new Error(
            "No Stripe customer record found. This user has not subscribed yet and cannot have their plan changed from the admin dashboard."
          );
        }
        throw new Error(error.error || "Failed to change subscription");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Subscription changed successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  // Mutation for cancelling subscription
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch("/api/change-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          action: "cancel",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          throw new Error("Unauthorized - Admin access required");
        }
        if (response.status === 404) {
          throw new Error("No active subscription found to cancel");
        }
        throw new Error(error.error || "Failed to cancel subscription");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Subscription cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
      setShowCancelConfirmation(false);
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
      setShowCancelConfirmation(false);
    },
  });

  const handleSubmit = () => {
    const selectedPlanData = plansData?.plans?.find(
      (plan: Plan) => plan.id === selectedPlan
    );

    if (!selectedPlanData) {
      toast.error("Please select a plan");
      return;
    }

    changeSubscriptionMutation.mutate({
      userId,
      planId: selectedPlanData.id,
      planType: selectedPlanData.type,
    });
  };

  const handleCancelSubscription = () => {
    setShowCancelConfirmation(true);
  };

  const confirmCancelSubscription = () => {
    cancelSubscriptionMutation.mutate(userId);
  };

  const getPlanIcon = (type: string) => {
    return type === "enterprise" ? (
      <Crown className="w-4 h-4" />
    ) : (
      <Zap className="w-4 h-4" />
    );
  };

  const getPlanBadgeVariant = (type: string) => {
    return type === "enterprise" ? "default" : "secondary";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change Subscription Plan</DialogTitle>
          <DialogDescription>
            Change the subscription plan for <strong>{userEmail}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {currentPlan && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan:</p>
                  <p className="font-medium">{currentPlan}</p>
                </div>
                {currentPlan &&
                  currentPlan !== "No Plan" &&
                  !showCancelConfirmation && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelSubscription}
                      disabled={
                        changeSubscriptionMutation.isPending ||
                        cancelSubscriptionMutation.isPending
                      }
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Plan
                    </Button>
                  )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Select New Plan</label>
            {plansError ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{plansError.message}</p>
              </div>
            ) : plansLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading plans...
                </span>
              </div>
            ) : (
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a subscription plan" />
                </SelectTrigger>
                <SelectContent>
                  {plansData?.plans?.map((plan: Plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      <div className="flex items-center space-x-2">
                        {getPlanIcon(plan.type)}
                        <span>{plan.name}</span>
                        <Badge
                          variant={getPlanBadgeVariant(plan.type)}
                          className="ml-2"
                        >
                          {plan.type === "enterprise" ? "Pro" : "Basic"}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedPlan && plansData?.plans && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              {(() => {
                const plan = plansData.plans.find(
                  (p: Plan) => p.id === selectedPlan
                );
                return (
                  <div>
                    <p className="font-medium text-blue-900">{plan?.name}</p>
                    <p className="text-sm text-blue-700">{plan?.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge variant={getPlanBadgeVariant(plan?.type || "")}>
                        {plan?.type === "enterprise" ? "Pro" : "Basic"}
                      </Badge>
                      <Badge variant="outline">
                        {plan?.billing === "monthly" ? "Monthly" : "Yearly"}
                      </Badge>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Cancellation Confirmation */}
        {showCancelConfirmation && (
          <div className="p-5 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl space-y-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 text-base">
                  Cancel Subscription
                </h4>
                <p className="text-sm text-red-700 mt-1 leading-relaxed">
                  Are you sure you want to cancel the subscription for{" "}
                  <span className="font-medium">{userEmail}</span>?
                </p>
                <div className="mt-2 p-2 bg-red-200/50 rounded-md">
                  <p className="text-xs text-red-800 font-medium">
                    ⚠️ This action cannot be undone and the user will lose
                    access immediately.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelConfirmation(false)}
                disabled={cancelSubscriptionMutation.isPending}
                className="flex-1 bg-white hover:bg-gray-50"
              >
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmCancelSubscription}
                disabled={cancelSubscriptionMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {cancelSubscriptionMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Confirm Cancel
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {!showCancelConfirmation && (
            <Button
              onClick={handleSubmit}
              disabled={
                !selectedPlan ||
                changeSubscriptionMutation.isPending ||
                cancelSubscriptionMutation.isPending
              }
            >
              {changeSubscriptionMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Plan"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionChangeDialog;
