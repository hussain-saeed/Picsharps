import OverviewStatistics from "./sections/OverviewStatistics";
import RecentActivities from "./sections/RecentActivities";
import Revenue from "./sections/Revenue";
import UserGrowth from "./sections/UserGrowth";

function OverviewWholePage() {
  return (
    <>
      <OverviewStatistics />
      <UserGrowth />
      <Revenue />
      <RecentActivities />
    </>
  );
}

export default OverviewWholePage;
