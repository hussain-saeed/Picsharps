import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Container from "../../components/Container";

function AllTools() {
  return (
    <>
      <Header />

      <div
        className="text-center"
        style={{
          backgroundColor: "rgb(245, 245, 245)",
          padding: "140px 0 135px 0",
        }}
      >
        <Container>
          <h1 className="font-black text-[30px] sm:text-[48px] mb-6">
            Edit Smarter
            <br />
            Create Faster
          </h1>
          <p className="max-w-[800px] mx-auto">
            Pick a tool below and start editing instantly — no experience needed
          </p>
        </Container>
      </div>

      <Footer />
    </>
  );
}

export default AllTools;
