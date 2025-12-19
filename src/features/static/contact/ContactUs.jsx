import { useCallback, useContext, useState } from "react";
import { LanguageContext } from "../../../context/LanguageContext";
import Container from "../../../components/Container";
import Header from "../../../components/Header";
import { useDropzone } from "react-dropzone";
import Footer from "../../../components/Footer";

const data = [
  {
    imgSrc: "/images/facebook-2.png",
    title: "Facebook",
  },
  {
    imgSrc: "/images/instagram-2.png",
    title: "Instagram",
  },
  {
    imgSrc: "/images/x-2.png",
    title: "X",
  },
  {
    imgSrc: "/images/linkedin-2.png",
    title: "LinkedIn",
  },
];

function ContactUs() {
  const { direction } = useContext(LanguageContext);
  const isRTL = direction === "rtl";

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [image, setImage] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setImage(
        Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        })
      );
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
    },
    multiple: false,
    onDrop,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRemove = () => {
    setImage(null);
  };

  const printFormData = (formData) => {
    const obj = {};

    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        obj[key] = {
          fileName: value.name,
          fileType: value.type,
          size: value.size + " bytes",
        };
      } else {
        obj[key] = value;
      }
    }

  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("subject", form.subject);
    formData.append("message", form.message);

    if (image) {
      formData.append("screenshot", image);
    } else {
      formData.append("screenshot", "");
    }

    printFormData(formData);
  };

  return (
    <>
      <Header />

      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(223, 242, 255, 0.5) 0%,  rgb(235, 235, 235) 100%)",
        }}
      >
        <Container>
          <section
            className={`
              w-full md:w-[85%] lg:w-full mx-auto
              flex flex-col items-center lg:items-start
              ${
                isRTL ? "lg:flex-row-reverse" : "lg:flex-row"
              } lg:gap-10 pt-[180px] pb-[120px] 
            `}
          >
            <div
              className={`
                lg:w-1/2 w-full
                xl:mt-8 2xl:mt-18
                flex flex-col text-center 
                ${isRTL ? "lg:text-right" : "lg:text-left"}
              `}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <h2
                className="text-[37px] sm:text-[60px] lg:text-[50px] xl:text-[60px]"
                style={{
                  fontWeight: "900",
                  marginBottom: "20px",
                  background: "var(--gradient-color)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Get In Touch
              </h2>
              <p
                className="mb-[70px] lg:mb-0"
                style={{
                  fontWeight: "500",
                  letterSpacing: "2px",
                  lineHeight: "30px",
                }}
              >
                looking for help and support to enhance your picsharps
                experience? Whether it’s learning how to fix a design problem
                with our online photo editor, searching for useful photo design
                tips via tutorials or finding inspiration from our community,
                we’ve got all the answers to your questions.
              </p>
            </div>

            <div
              className={`
                lg:w-1/2 w-full
                flex
              `}
            >
              <img
                src="/images/hero-abstract-2.png"
                alt="hero"
                className="w-full h-auto object-contain"
              />
            </div>
          </section>

          <div
            className={`w-full flex flex-wrap gap-6 justify-between items-start lg:items-center pb-[120px] ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <form
              onSubmit={handleSubmit}
              className="
                w-full 
                lg:w-[66%] 
               bg-white p-8 md:p-18 
                flex flex-col gap-8
              "
              dir={isRTL ? "rtl" : "ltr"}
              style={{
                borderRadius: "50px",
                boxShadow: "0px 0px 4px 1px rgba(0, 140, 255, 0.25)",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  marginBottom: "-20px",
                }}
              >
                Send us a message
              </h2>
              <p
                style={{
                  color: "rgba(137, 137, 137, 1)",
                  marginBottom: "5px",
                }}
              >
                Fill out this form below and we'll get back to you soon
              </p>

              <div className="flex flex-col">
                <label className="font-medium mb-1.5">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="Your full name"
                  type="text"
                  name="name"
                  required
                  onChange={handleChange}
                  className="py-3 px-5 rounded-lg w-full"
                  style={{
                    backgroundColor: "rgba(245, 245, 245, 1)",
                    border: "1px solid rgba(199, 199, 199, 1)",
                  }}
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="your.example@gmail.com"
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  className="py-3 px-5 rounded-lg w-full"
                  style={{
                    backgroundColor: "rgba(245, 245, 245, 1)",
                    border: "1px solid rgba(199, 199, 199, 1)",
                  }}
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1">
                  Subject <span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="What is this about ?"
                  type="text"
                  name="subject"
                  required
                  onChange={handleChange}
                  className="py-3 px-5 rounded-lg w-full"
                  style={{
                    backgroundColor: "rgba(245, 245, 245, 1)",
                    border: "1px solid rgba(199, 199, 199, 1)",
                  }}
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1">
                  Message <span className="text-red-600">*</span>
                </label>
                <textarea
                  placeholder="How can we help you ?"
                  name="message"
                  required
                  onChange={handleChange}
                  className="py-3 px-5 rounded-lg w-full resize-none h-42"
                  style={{
                    backgroundColor: "rgba(245, 245, 245, 1)",
                    border: "1px solid rgba(199, 199, 199, 1)",
                  }}
                ></textarea>
              </div>

              <label className="font-medium" style={{ marginBottom: "-20px" }}>
                Attach screenshot (optional)
              </label>

              {!image && (
                <div
                  {...getRootProps()}
                  className=" p-12 rounded-md text-center cursor-pointer mb-4"
                  style={{ border: "1px dashed rgba(199, 199, 199, 1)" }}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p style={{ fontSize: "14px" }}>Drop the image here ...</p>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "14px",
                      }}
                    >
                      {isRTL ? (
                        <img src="/images/attach-2.png" />
                      ) : (
                        <img src="/images/attach.png" />
                      )}
                      <p>Click or drag to upload</p>
                    </div>
                  )}
                </div>
              )}

              {image && (
                <div className="relative inline-block w-fit">
                  <img
                    src={image.preview}
                    alt="Uploaded"
                    className="w-32 h-32 object-cover rounded-md"
                    style={{ border: "1px solid rgba(199, 199, 199, 1)" }}
                  />

                  <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm cursor-pointer pb-0.5 pl-px"
                  >
                    x
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="text-white py-3 rounded-lg flex items-center justify-center gap-4 text-[20px] font-semibold cursor-pointer"
                style={{ background: "var(--gradient-color-2)" }}
              >
                {isRTL ? (
                  <img src="/images/send-3.png" alt="Send" />
                ) : (
                  <img src="/images/send-2.png" alt="Send" />
                )}
                Send message
              </button>
            </form>

            <div
              className={`w-full 
                lg:w-[30%] 
                flex flex-wrap gap-8 items-start lg:items-center
                ${isRTL ? "flex-row-reverse" : ""}
              `}
            >
              <div
                className="w-full sm:w-[47%] lg:w-full bg-white p-10 text-center h-[350px] flex justify-center items-center flex-col"
                style={{
                  borderRadius: "50px",
                  boxShadow: "0px 0px 4px 1px rgba(0, 140, 255, 0.25)",
                }}
              >
                <img
                  src="/images/support.png"
                  alt="support"
                  className="mx-auto mb-2"
                />
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  Support
                </span>
                <p
                  style={{
                    marginTop: "25px",
                    marginBottom: "15px",
                  }}
                >
                  Submit the form and we'll get back to you
                </p>
                <p style={{ color: "rgba(137, 137, 137, 1)" }}>
                  Available 24/7 for your convenience
                </p>
              </div>
              <div
                className="w-full sm:w-[47%] lg:w-full bg-white p-10 text-center h-[350px] flex justify-center items-center flex-col"
                style={{
                  borderRadius: "50px",
                  boxShadow: "0px 0px 4px 1px rgba(0, 140, 255, 0.25)",
                }}
              >
                <img
                  src="/images/company.png"
                  alt="company"
                  className="mx-auto mb-2"
                />
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  Company type
                </span>
                <p
                  style={{
                    marginTop: "25px",
                    marginBottom: "15px",
                  }}
                >
                  Online-based company
                </p>
                <p style={{ color: "rgba(137, 137, 137, 1)" }}>
                  No physical office location
                </p>
              </div>
              <div
                className="w-full sm:w-[47%] lg:w-full bg-white py-10 px-9"
                style={{
                  backgroundColor: "rgba(240, 253, 244, 1)",
                  borderRadius: "50px",
                  border: "1px solid rgba(169, 255, 196, 1)",
                }}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "start",
                    gap: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <img
                    src="/images/right.png"
                    alt="right"
                    style={{ marginTop: "5px" }}
                  />
                  <p
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    ⏱️ We respond within 24-48 hours
                  </p>
                </div>
                <p
                  style={{
                    textAlign: isRTL ? "right" : "left",
                    color: "rgba(75, 85, 99, 1)",
                  }}
                >
                  Our team reviews every message and gets back to you promptly
                </p>
              </div>
            </div>
          </div>

          <section style={{ paddingBottom: "140px" }}>
            <div style={{ marginBottom: "60px", textAlign: "center" }}>
              <h2
                className="text-[32px] sm:text-[40px]"
                style={{
                  fontWeight: 700,
                }}
              >
                Connect With Us
              </h2>
              <p style={{ color: "rgba(100, 100, 100, 1)" }}>
                Follow us on social media for updates and tips
              </p>
            </div>
            <div
              className={`w-full flex flex-wrap gap-12 justify-center ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {data.map((item, index) => (
                <div
                  key={index}
                  className="
                    w-full 
                    sm:w-[45%] 
                    lg:w-[20%]
                  bg-white pt-8 pb-9 rounded-4xl 
                    flex flex-col items-center text-center
                  "
                  style={{
                    boxShadow: "0px 4px 4px 0px rgba(64, 175, 255, 0.25)",
                  }}
                >
                  <img src={item.imgSrc} alt={item.title} className="mb-3" />
                  <h2
                    style={{
                      fontSize: "24px",
                      fontWeight: "500",
                    }}
                  >
                    {item.title}
                  </h2>
                  <span
                    style={{
                      color: "rgba(91, 91, 91, 1)",
                      fontSize: "13px",
                      fontWeight: "500",
                      letterSpacing: "2px",
                    }}
                  >
                    Follow Us
                  </span>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </div>

      <Footer />
    </>
  );
}

export default ContactUs;
