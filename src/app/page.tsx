// import Dashboard from "./Dashboard";
import { Users } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Dashboard from "./Dashboard";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="p-4 min-h-screen bg-slate-50">
      <main className="w-full">
        <h1 className="text-3xl font-bold">GovGPT Dashboard</h1>
        <Dashboard />
      </main>
    </div>
  );
}
