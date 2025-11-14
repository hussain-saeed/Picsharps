import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useLocation } from "react-router-dom";

const Dropzone = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [status, setStatus] = useState(""); // "success" | "error"
  const [message, setMessage] = useState("");
  const isCollage = currentPath === "/collage-maker";

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      setStatus("");
      setMessage("");

      // handle rejected files immediately
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const error = rejection.errors[0];
        let customMessage;

        switch (error.code) {
          case "too-many-files":
            customMessage = "Not Allowed to Upload More Than 1 Image";
            break;

          case "file-invalid-type":
            customMessage = "Only PNG, JPG, JPEG Formats Are Allowed";
            break;

          case "file-too-large":
            customMessage =
              "Not Allowed to Upload Image That Is Larger Than 10MB";
            break;

          default:
            customMessage = error.message;
            break;
        }

        switch (error.message) {
          case "File type must be one of image/jpeg, .jpeg, .jpg, image/png, .png":
            customMessage = "Only PNG, JPG, JPEG Formats Are Allowed";
        }

        setStatus("error");
        setMessage(customMessage);
        return;
      }

      // update state with new files
      const newFiles = isCollage
        ? [...uploadedFiles, ...acceptedFiles] // multiple allowed
        : [...acceptedFiles]; // single upload replaces

      setUploadedFiles(newFiles);

      // show success
      setStatus("success");
      setMessage("Upload Successful!");

      // log final files for verification
      console.log("Files ready to send:", newFiles);
    },
    [isCollage, uploadedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    maxSize: 10 * 1024 * 1024,

    multiple: isCollage,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed rgba(0, 0, 0, 0.31)",
        padding: "70px",
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <input {...getInputProps()} />

      <div>
        {isDragActive ? (
          <span
            style={{
              fontWeight: "400",
              fontSize: "18px",
            }}
          >
            {isCollage ? "Drop the Image(s) Here" : "Drop the Image Here"}
          </span>
        ) : (
          <>
            <div
              style={{
                backgroundColor: "rgba(195, 231, 249, 1)",
                width: "fit-content",
                padding: "20px",
                borderRadius: "50%",
                margin: "auto",
                marginBottom: "14px",
              }}
            >
              <img src="/images/upload.png" />
            </div>
            <h2
              style={{
                fontWeight: "500",
                fontSize: "20px",
                marginBottom: "20px",
              }}
            >
              Drag & Drop or Click to Upload
            </h2>
            <span style={{ fontSize: "15px", fontWeight: "300" }}>
              PNG, JPG, JPEG --- Max size 10MB
            </span>
          </>
        )}
      </div>

      {isDragActive ? (
        ""
      ) : (
        <>
          {status === "success" && (
            <p style={{ color: "green", marginTop: "8px" }}>{message}</p>
          )}
          {status === "error" && (
            <p style={{ color: "red", marginTop: "8px" }}>{message}</p>
          )}
        </>
      )}

      {/* Preview للصور المرفوعة */}
      {isDragActive ? (
        ""
      ) : (
        <>
          {uploadedFiles.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "15px",
                justifyContent: "center",
              }}
            >
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    width: "100px",
                    height: "100px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dropzone;
