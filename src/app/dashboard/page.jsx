import UserDashboardPage from "../components/UserDashboard/Page";

export const metadata = {
  title: "Dashboard — CraftSite",
  description: "Manage your CraftSite projects.",
};

export default function DashboardRoute() {
  return <UserDashboardPage />;
}