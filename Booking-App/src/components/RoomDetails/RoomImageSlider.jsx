import React, { useState } from "react";
import "./RoomDetails.css";

const RoomImageSlider = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages =
    images && images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"];

  const handlePrev = () =>
    setCurrentIndex(p => p === 0 ? displayImages.length - 1 : p - 1);

  const handleNext = () =>
    setCurrentIndex(p => p === displayImages.length - 1 ? 0 : p + 1);

  return (
    <div className="slider">
      <img
        src={displayImages[currentIndex]}
        alt="Room"
        className="slider__img"
      />

      {displayImages.length > 1 && (
        <>
          <button className="slider__btn slider__btn--left" onClick={handlePrev}>❮</button>
          <button className="slider__btn slider__btn--right" onClick={handleNext}>❯</button>

          {/* Dots */}
          <div className="slider__dots">
            {displayImages.map((_, i) => (
              <span
                key={i}
                className={`slider__dot ${i === currentIndex ? "slider__dot--active" : ""}`}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>
        </>
      )}

      {/* Image count pill */}
      {displayImages.length > 1 && (
        <span className="slider__count">
          📷 {currentIndex + 1}/{displayImages.length}
        </span>
      )}
    </div>
  );
};

export default RoomImageSlider;