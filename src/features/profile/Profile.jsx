import { useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import ProtectedRoute from "../auth/ProtectedRoute";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Container from "../../components/Container";
import { CiUser } from "react-icons/ci";
import { CiCreditCard1 } from "react-icons/ci";
import { LuDownload } from "react-icons/lu";
import { MdOutlineLogout } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import Edit from "./sections/Edit";
import { LanguageContext } from "../../context/LanguageContext";
import { Download } from "lucide-react";
import Downloads from "./sections/Downloads";
import { BACKEND_URL } from "../../api";
import English from "/src/i18n/english.json";
import Arabic from "/src/i18n/arabic.json";
import Subscriptions from "./sections/Subscriptions";
import Loader from "/src/components/Loader";

const translations = { English, Arabic };

const tabsData = [
  { id: 0, label: "User Data", key: "profile", icon: <CiUser /> },
  {
    id: 1,
    label: "Subscriptions",
    key: "billing",
    icon: <CiCreditCard1 />,
  },
  { id: 2, label: "My Downloads", key: "downloads", icon: <LuDownload /> },
];

function Profile() {
  const { accessToken, logout } = useAuth();
  const { language, direction } = useContext(LanguageContext);
  const t = translations[language] || translations["English"];
  const isRTL = direction === "rtl";

  const [data, setData] = useState(null);
  const [billings, setBillings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [renderedSection, setRenderedSection] = useState(() => {
    const fromSuccess = localStorage.getItem("comesFromSuccess") === "true";

    if (fromSuccess) {
      localStorage.removeItem("comesFromSuccess");
    }

    return fromSuccess ? 1 : 0;
  });

  const handleTabClick = (id) => {
    setRenderedSection(id);
    window.scrollTo({
      top: 130,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);

      try {
        const userRes = await fetch(`${BACKEND_URL}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
        const userData = await userRes.json();
        setData(userData);
        console.log(userData);

        const billingRes = await fetch(`${BACKEND_URL}/billing/history`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
        const billingData = await billingRes.json();
        setBillings(billingData);
      } catch (err) {
        console.error("Error fetching profile or billing:", err);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1200);
      }
    };

    fetchAll();
  }, [accessToken]);

  return (
    <ProtectedRoute>
      <Header />

      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(223, 242, 255, 0.2) 0%, rgba(255, 255, 255, 1) 100%)",
        }}
        className="pt-0 lg:pt-40 pb-[140px]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Container>
          <div
            className="sticky top-19 h-fit lg:hidden shadow-md mb-30 bg-white flex items-center justify-center w-[90%] mx-auto pt-5 pb-[18px] px-4"
            style={{
              borderBottomLeftRadius: "30px",
              borderBottomRightRadius: "30px",
              zIndex: 50,
            }}
          >
            {tabsData.map((tab) => (
              <div
                key={tab.id}
                className={`
                    px-4 py-2.5 rounded-xl cursor-pointer flex items-center
                    ${
                      renderedSection === tab.id
                        ? "text-white text-2xl"
                        : "text-gray-600 text-xl"
                    }
                  `}
                style={{
                  background:
                    renderedSection === tab.id
                      ? "var(--gradient-color-2)"
                      : "white",
                }}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.icon}
              </div>
            ))}
            <button
              className={`text-red-500 flex items-center cursor-pointer bg-red-300 p-2 rounded-lg ${
                isRTL ? "mr-2" : "ml-2"
              } text-2xl`}
              onClick={() => logout()}
            >
              {isRTL ? <CiLogout /> : <MdOutlineLogout />}
            </button>
          </div>

          <h2 className="text-center lg:mb-20 mb-8 text-4xl font-bold lg:text-5xl lg:font-extrabold">
            {t["MANAGE YOUR ACCOUNT!"]}
          </h2>
          {isLoading ? (
            <Loader
              className="-mt-14 lg:-mt-24"
              style={{ marginBottom: "165px" }}
            />
          ) : (
            <div className="flex gap-8 flex-col lg:flex-row">
              {/* Sidebar - Sticky */}
              <div
                className="sticky top-32 lg:block hidden w-[32%] p-12 h-fit"
                style={{
                  borderRadius: "30px",
                  border: "1px solid rgba(221, 221, 221, 1)",
                  boxShadow: "0px 0px 4px 1px rgba(0, 140, 255, 0.25)",
                }}
              >
                <div
                  className="flex flex-col space-y-4 pb-14 mb-8"
                  style={{ borderBottom: "1px solid rgba(221, 221, 221, 1)" }}
                >
                  {tabsData.map((tab) => (
                    <div
                      key={tab.id}
                      className={`
                    px-4 py-2.5 rounded-4xl cursor-pointer flex items-center gap-2
                    ${
                      renderedSection === tab.id
                        ? "text-white font-semibold"
                        : "text-gray-600"
                    }
                  `}
                      style={{
                        background:
                          renderedSection === tab.id
                            ? "var(--gradient-color-2)"
                            : "rgb(248, 248, 248)",
                      }}
                      onClick={() => handleTabClick(tab.id)}
                    >
                      <div
                        className={`w-8 h-6 flex items-center justify-center ${
                          renderedSection === tab.id ? "text-2xl" : "text-xl"
                        }`}
                      >
                        {tab.icon}
                      </div>
                      <span>{t[tab.label]}</span>
                    </div>
                  ))}
                </div>

                {/* Logout Button */}
                <button
                  className="w-full text-red-500 px-4 py-2.5 flex items-center gap-2 cursor-pointer"
                  onClick={() => logout()}
                >
                  <div className="w-8 h-6 flex items-center justify-center text-xl">
                    {isRTL ? <CiLogout /> : <MdOutlineLogout />}
                  </div>
                  <span style={{ fontWeight: "500" }}>{t["Log Out"]}</span>
                </button>
              </div>

              {/* Main Content */}
              <div
                className="flex-1 p-8"
                style={{
                  borderRadius: "30px",
                  boxShadow: "0px 0px 4px 1px rgba(205, 228, 247, 1)",
                  border: "1px solid rgba(221, 221, 221, 1)",
                }}
              >
                <div
                  style={{
                    borderBottom: "1px dashed rgba(186, 186, 186, 1)",
                    paddingBottom: "25px",
                    marginBottom: renderedSection === 0 ? "25px" : "35px",
                  }}
                >
                  <h1 style={{ fontSize: "20px", fontWeight: "500" }}>
                    {renderedSection === 0
                      ? t["User Data"]
                      : renderedSection === 1
                      ? t["Subscriptions"]
                      : t["My Downloads"]}
                  </h1>
                  {renderedSection === 2 ? (
                    <p
                      style={{ fontSize: "15px", color: "rgba(58, 58, 58, 1)" }}
                    >
                      {t["Images you've downloaded in the last 30 days"]}
                    </p>
                  ) : (
                    ""
                  )}
                </div>

                {renderedSection === 0 ? (
                  <Edit />
                ) : renderedSection === 2 ? (
                  <Downloads data={data} />
                ) : (
                  <Subscriptions data={data} billings={billings} />
                )}
              </div>
            </div>
          )}
        </Container>
      </div>

      <Footer />
    </ProtectedRoute>
  );
}

export default Profile;
