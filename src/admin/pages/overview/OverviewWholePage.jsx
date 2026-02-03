import { useState, useEffect, useCallback } from "react";
import Countries from "./sections/Countries";
import OverviewStatistics from "./sections/OverviewStatistics";
import RecentActivities from "./sections/RecentActivities";
import Revenue from "./sections/Revenue";
import UserGrowth from "./sections/UserGrowth";
import { FullBleedSection } from "../../components/FullBleedSection";
import HugeLoader from "../../components/HugeLoader";
import Loader from "../../../components/Loader";
import { LoadingDots } from "../../components/LoadingDots";

const INITIAL_LOADING_STATE = {
  stats: false,
  countries: false,
  growth: false,
  revenue: false,
  activities: false,
};

function OverviewWholePage() {
  const [status, setStatus] = useState(INITIAL_LOADING_STATE);

  useEffect(() => {
    setStatus(INITIAL_LOADING_STATE);
  }, []);

  const markAsDone = useCallback((id, isDone) => {
    setStatus((prev) => ({
      ...prev,
      [id]: isDone,
    }));
  }, []);

  const countOfDone = Object.values(status).filter(Boolean).length;
  const isAllLoaded = countOfDone >= 5;

  return (
    <div
      className={`relative ${!isAllLoaded ? "max-h-dvh overflow-hidden" : ""}`}
    >
      {!isAllLoaded && (
        <div className="z-29 absolute inset-0 flex justify-center pt-40 bg-[#f7ffff] h-full w-full">
          <LoadingDots
            loadingSize="2rem"
            loadingWeight="600"
            dotsSize="2.5rem"
            dotsWeight="bold"
          />
        </div>
      )}

      <div className="pt-8 pb-16">
        <OverviewStatistics markAsDone={(val) => markAsDone("stats", val)} />
      </div>
      <FullBleedSection bg="rgb(255, 255, 255)" className="pt-12 sm:pb-18">
        <Countries markAsDone={(val) => markAsDone("countries", val)} />
      </FullBleedSection>
      <div className="pt-12 pb-16">
        <UserGrowth markAsDone={(val) => markAsDone("growth", val)} />
      </div>
      <FullBleedSection bg="rgb(255, 255, 255)" className="pt-12 pb-16">
        <Revenue markAsDone={(val) => markAsDone("revenue", val)} />
      </FullBleedSection>
      <div className="pt-12 pb-6">
        <RecentActivities markAsDone={(val) => markAsDone("activities", val)} />
      </div>
    </div>
  );
}

export default OverviewWholePage;
