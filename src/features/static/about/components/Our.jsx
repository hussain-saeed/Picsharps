import { useContext } from "react";
import { LanguageContext } from "../../../../context/LanguageContext";

export default function Our({
  isWhite,
  readyImage,
  gridain,
  image,
  icon,
  title,
  paragraph,
}) {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  return (
    <div
      className={`
        w-full lg:w-[65%] 
        mx-auto 
        flex flex-col items-center justify-center 
        pt-7 md:pt-14 px-10 lg:px-28 pb-10 md:pb-20
        transition
        ${isWhite ? "text-black" : "text-white"}
      `}
      style={{
        borderRadius: "30px",
        boxShadow: "0px 4px 4px 0px rgba(64, 175, 255, 0.25)",
        background: isWhite ? "white" : "var(--gradient-color-2)",
      }}
    >
      {readyImage && <img src={image} alt={title} className="mb-5" />}

      {readyImage || (
        <div
          className="mb-5"
          style={{
            width: "81px",
            height: "81px",
            background:
              gridain === true
                ? "var(--gradient-color-2)"
                : "rgba(51, 206, 197, 1)",
            borderRadius: "15px",
            boxShadow: gridain === true ? "none" : "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" ,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={icon} alt={title} />
        </div>
      )}

      <h2
        className="mb-6 text-center text-[35px] sm:text-[40px]"
        style={{ fontWeight: "700" }}
      >
        {title}
      </h2>

      <p
        className="text-center"
        style={{ fontWeight: "500", letterSpacing: "2px" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {paragraph}
      </p>
    </div>
  );
}
