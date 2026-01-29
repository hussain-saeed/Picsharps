import Countries from "./sections/Countries";
import OverviewStatistics from "./sections/OverviewStatistics";
import RecentActivities from "./sections/RecentActivities";
import Revenue from "./sections/Revenue";
import UserGrowth from "./sections/UserGrowth";

function OverviewWholePage() {
  return (
    <>
      <OverviewStatistics />
      <Countries />
      <UserGrowth />
      <Revenue />
      <RecentActivities />
    </>
  );
}

export default OverviewWholePage;
