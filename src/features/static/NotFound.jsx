import Header from "../../components/Header";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <Header />
      <div
        style={{
          background:
            "linear-gradient(141deg, #F7FFFB 0%, #E9FCF4 25%, #E7F8FA 60%, #E4F4FC 100%)",
        }}
      >
        <Container className="pt-40 pb-40 flex flex-col justify-center items-center">
          <img src="/images/not-found2.png" alt="not found" className="mb-5" />
          <Link
            to="/"
            className="text-[20px] sm:text-[24px] underline"
            style={{
              fontWeight: "900",
            }}
          >
            Back to Home
          </Link>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default NotFound;
