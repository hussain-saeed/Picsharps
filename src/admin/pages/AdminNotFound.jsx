import Container from "../../components/Container";
import { Link } from "react-router-dom";
import { useMemo } from "react";

function AdminNotFound() {
  const images = [
    "/images/not-found-admin.png",
    "/images/not-found-admin-2.png",
  ];

  // اختيار صورة عشوائية مرة واحدة عند الرندر
  const randomImage = useMemo(() => {
    const index = Math.floor(Math.random() * images.length);
    return images[index];
  }, []);

  return (
    <div>
      <Container className="pt-30 pb-40 flex flex-col justify-center items-center">
        <img src={randomImage} alt="not found" className="mb-5" />

        <Link
          to="/admin8yut91b9e22a/main"
          className="text-[20px] sm:text-[24px] underline"
          style={{ fontWeight: "900" }}
        >
          Back to Home
        </Link>
      </Container>
    </div>
  );
}

export default AdminNotFound;
