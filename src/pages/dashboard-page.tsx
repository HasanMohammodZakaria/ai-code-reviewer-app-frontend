import { DashboardHeader } from "../components/stats/dashboard-header";
import { DashboardView } from "../components/stats/dashboard-view";

export function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <DashboardHeader />
      <DashboardView />
    </div>
  );
}
