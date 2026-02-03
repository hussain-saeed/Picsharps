import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { CiMail } from "react-icons/ci";
import { MdOutlineDateRange } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { TfiTimer } from "react-icons/tfi";
import { CiLocationOn } from "react-icons/ci";

export default function AdminMainIndex() {
  const { admin } = useSelector((s) => s.adminAuth);

  const fullName = admin.name || "Admin";
  const firstName = fullName.split(" ")[0];

  const email = admin.email;

  const [currentTime, setCurrentTime] = useState(new Date());

  // تحديث الوقت كل ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // تحويل كود الدولة لاسم الدولة
  let countryName = "Unknown";
  if (admin.lastLogInCountry && admin.lastLogInCountry.length === 2) {
    try {
      const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
      countryName = regionNames.of(admin.lastLogInCountry.toUpperCase());
    } catch (e) {
      countryName = admin.lastLogInCountry;
    }
  }

  const countryCode = (admin.lastLogInCountry || "EG").toUpperCase();

  const [showFlag, setShowFlag] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFlag(true);
    }, 1000); // يظهر بعد 2 ثانية

    return () => clearTimeout(timer); // تنظيف التايمر لما الكومبوننت يتشال
  }, []);

  return (
    <div
      style={{ padding: "30px", border: "1px solid rgba(228, 228, 228, 1)" }}
      className="bg-white w-full sm:w-fit rounded-2xl"
    >
      {/* Welcome Card */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center sm:text-left">
        Welcome,{" "}
        <span
          style={{
            background: "var(--gradient-color)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {firstName}!
        </span>
      </h1>

      <p className="text-gray-600 text-md md:text-lg mb-6 text-center sm:text-left truncate">
        {email}
      </p>

      <div
        className="flex justify-between gap-8 xl:gap-14 flex-wrap xl:flex-row flex-col pt-6"
        style={{ borderTop: "2.5px dashed rgb(225, 225, 225)" }}
      >
        {/* Date */}
        <div>
          <p className="text-sm text-gray-500 flex gap-1">
            <SlCalender className="text-md" style={{ marginTop: "1px" }} />
            <span>Data</span>
          </p>
          <p className="font-medium text-lg">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Time (يتحدث كل ثانية) */}
        <div>
          <p className="text-sm text-gray-500 flex gap-1">
            <TfiTimer style={{ marginTop: "1px", fontSize: "16px" }} />
            <span>Time</span>
          </p>{" "}
          <p className="font-medium text-lg tabular-nums">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZoneName: "short", // اختياري: يضيف الـ timezone مثل EET
            })}
          </p>
        </div>

        {/* Country with flag */}
        <div className="flex items-center gap-3">
          <div className="text-left">
            <p className="text-sm text-gray-500 flex gap-1">
              <CiLocationOn style={{ marginLeft: "-2px", fontSize: "17px" }} />
              <span style={{ marginLeft: "-2px" }}>Logged In Country</span>
            </p>{" "}
            <div className="flex items-center gap-2">
              <p className="font-medium">{countryName}</p>
              <div
                style={{ opacity: showFlag ? "1" : "0" }}
                className="w-7 h-4 flex justify-center items-center border border-gray-300 shadow-sm -skew-x-12 rounded overflow-hidden transition-opacity duration-500 ease-in-out"
              >
                <img
                  src={`https://flagsapi.com/${countryCode}/flat/64.png`}
                  alt={countryName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://flagsapi.com/XX/flat/64.png"; // fallback
                    e.target.alt = "Unknown";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
