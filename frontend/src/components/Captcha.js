import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import "./captcha.css";
import dog from "../assets/dog.jpeg";
import dog2 from "../assets/dog2.jpeg";
import dog3 from "../assets/dog3.jpeg";
import dog4 from "../assets/dog4.jpg";
import cat from "../assets/cat.jpeg";
import cat2 from "../assets/cat2.jpeg";
import pig from "../assets/pig.jpeg";
import pig2 from "../assets/pig2.jpeg";
import dog5 from "../assets/dog5.jpeg";
import sampleDog from "../assets/sample-dog.jpeg";

const Captcha = forwardRef(({ onVerify }, ref) => {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImageGrid, setShowImageGrid] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [shuffledImages, setShuffledImages] = useState([]);

  const images = [
    { id: 1, url: dog, isDog: true },
    { id: 2, url: cat, isDog: false },
    { id: 3, url: dog3, isDog: true },
    { id: 4, url: pig, isDog: false },
    { id: 5, url: dog4, isDog: true },
    { id: 6, url: cat2, isDog: false },
    { id: 7, url: dog2, isDog: true },
    { id: 8, url: pig2, isDog: false },
    { id: 9, url: dog5, isDog: true },
  ];

  useImperativeHandle(ref, () => ({
    resetCaptcha: () => {
      setIsChecked(false);
      setSelectedImages([]);
      setShowImageGrid(false);
      setIsVerified(false);
      shuffleImages();
    }
  }));

  useEffect(() => {
    shuffleImages();
  }, []);

  useEffect(() => {
    if (isChecked && !isVerified) {
      const timer = setTimeout(() => {
        setShowImageGrid(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isChecked, isVerified]);

  const shuffleImages = () => {
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  };

  const handleCheckboxChange = (event) => {
    if (!isVerified) {
      setIsChecked(event.target.checked);
      if (event.target.checked) {
        shuffleImages();
      }
    }
  };

  const handleImageClick = (id) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((imageId) => imageId !== id)
        : [...prevSelected, id]
    );
  };

  const handleVerify = () => {
    console.log("Selected Images:", selectedImages);
    const selectedNonDogs = selectedImages.filter((id) => {
      const image = images.find((img) => img.id === id);
      return image && !image.isDog;
    });

    console.log("Selected Non-Dogs:", selectedNonDogs);

    const allDogs = images.filter((img) => img.isDog).map((img) => img.id);
    const allDogsSelected = allDogs.every((dogId) =>
      selectedImages.includes(dogId)
    );

    if (selectedNonDogs.length > 0) {
      setDialogMessage("Please select only the pictures of dogs.");
      setShowDialog(true);
    } else if (!allDogsSelected) {
      setDialogMessage("Please select all the dog pictures.");
      setShowDialog(true);
    } else {
      setIsVerified(true);
      setIsChecked(true);
      setDialogMessage("Captcha verified successfully!");
      setShowDialog(true);
      setShowImageGrid(false);
      onVerify(true);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  return (
    <>
      <div className="check-captcha">
        <input
          type="checkbox"
          id="captcha-checkbox"
          name="captcha-checkbox"
          checked={isChecked || isVerified}
          onChange={handleCheckboxChange}
          disabled={isVerified}
          style={{
            accentColor: isVerified ? 'blue' : 'white',
            border: isVerified ? '2px solid blue' : '2px solid white',
            backgroundColor: isVerified ? 'blue' : (isChecked ? 'white' : 'transparent'),
          }}
        />
        <label htmlFor="captcha-checkbox">
          {isVerified ? "Captcha Verified" : "Verify captcha"}
        </label>
      </div>
      {showImageGrid && !isVerified && (
        <div className="captcha-popup">
          <div className="captcha-container">
            <div className="sample-image">
              <h3>Select all images below that match this one:</h3>
              <img src={sampleDog} alt="Sample Dog" />
            </div>
            <div className="image-grid">
              {shuffledImages.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={`Option ${image.id}`}
                  className={
                    selectedImages.includes(image.id) ? "selected" : ""
                  }
                  onClick={() => handleImageClick(image.id)}
                  style={{
                    border: selectedImages.includes(image.id)
                      ? "2px solid blue"
                      : "none",
                  }}
                />
              ))}
            </div>
            <button onClick={handleVerify} className="verify-button active">
              Verify
            </button>
          </div>
        </div>
      )}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>{dialogMessage}</p>
            <button onClick={handleCloseDialog}>OK</button>
          </div>
        </div>
      )}
    </>
  );
});

export default Captcha;
