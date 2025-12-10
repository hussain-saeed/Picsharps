import { useContext, useState } from "react";
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

const tabsData = [
  { id: 0, label: "Profile", key: "profile", icon: <CiUser /> },
  {
    id: 1,
    label: "Billing & Subscription",
    key: "billing",
    icon: <CiCreditCard1 />,
  },
  { id: 2, label: "My Downloads", key: "downloads", icon: <LuDownload /> },
];

function Profile() {
  const { logout } = useAuth();
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  const [renderedSection, setRenderedSection] = useState(0);
  const handleTabClick = (id) => {
    setRenderedSection(id);
  };

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
              className="text-red-500 flex items-center cursor-pointer bg-red-300 p-2 rounded-lg ml-4 text-2xl"
              onClick={() => logout()}
            >
              {isRTL ? <CiLogout /> : <MdOutlineLogout />}
            </button>
          </div>

          <h2
            className="text-center lg:mb-20 mb-8"
            style={{
              fontSize: "48px",
              fontWeight: "900",
            }}
          >
            MANAGE YOUR Account !
          </h2>
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
                          : "white",
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
                    <span> {tab.label}</span>
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
                <span style={{ fontWeight: "500" }}>Log Out</span>
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
                  marginBottom: "25px",
                }}
              >
                <h1 style={{ fontSize: "20px", fontWeight: "500" }}>
                  {renderedSection === 0
                    ? "Profile"
                    : renderedSection === 1
                    ? "Billing and Subscription"
                    : "Downloads"}
                </h1>
                {renderedSection === 2 ? (
                  <p style={{ fontSize: "15px", color: "rgba(58, 58, 58, 1)" }}>
                    Images you've downloaded in the last 30 days
                  </p>
                ) : (
                  ""
                )}
              </div>

              {renderedSection === 0 ? (
                <Edit />
              ) : renderedSection === 1 ? (
                <div></div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Footer />
    </ProtectedRoute>
  );
}

export default Profile;
