import Countries from "./sections/Countries";
import OverviewStatistics from "./sections/OverviewStatistics";
import RecentActivities from "./sections/RecentActivities";
import Revenue from "./sections/Revenue";
import UserGrowth from "./sections/UserGrowth";
import { FullBleedSection } from "../../components/FullBleedSection";
import HugeLoader from "../../components/HugeLoader";

function OverviewWholePage() {
  return (
    <>
      <div className="pt-8 pb-16">
        <OverviewStatistics />
      </div>
      <FullBleedSection bg="rgb(255, 255, 255)" className="pt-12 sm:pb-18">
        <Countries />
      </FullBleedSection>
      <div className="pt-12 pb-16">
        <UserGrowth />
      </div>
      <FullBleedSection bg="rgb(255, 255, 255)" className="pt-12 pb-16">
        <Revenue />
      </FullBleedSection>
      <div className="pt-12 pb-6">
        <RecentActivities />
      </div>
    </>
  );
}

export default OverviewWholePage;
