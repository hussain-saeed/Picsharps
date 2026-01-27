import OverviewStatistics from "./sections/OverviewStatistics";
import RecentActivities from "./sections/RecentActivities";
import UserGrowth from "./sections/UserGrowth";

function OverviewWholePage() {
  return (
    <>
      <OverviewStatistics />
      <UserGrowth />
      <RecentActivities />
    </>
  );
}

export default OverviewWholePage;
