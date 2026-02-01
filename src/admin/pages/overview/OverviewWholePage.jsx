import Countries from "./sections/Countries";
import OverviewStatistics from "./sections/OverviewStatistics";
import RecentActivities from "./sections/RecentActivities";
import Revenue from "./sections/Revenue";
import UserGrowth from "./sections/UserGrowth";
import { FullBleedSection } from "../../components/FullBleedSection";

function OverviewWholePage() {
  return (
    <>
      <div className="pb-8">
        <OverviewStatistics />
      </div>
      <FullBleedSection bg="rgb(255, 255, 255)" className="pt-4 sm:pb-12">
        <Countries />
      </FullBleedSection>
      <div>
        <UserGrowth />
      </div>
      <div>
        <Revenue />
      </div>
      <div>
        <RecentActivities />
      </div>
    </>
  );
}

export default OverviewWholePage;
