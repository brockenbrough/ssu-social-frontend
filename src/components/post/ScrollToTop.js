import React, { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Function to handle the scroll event
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener to window
    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    isVisible && (
      <button
        onClick={handleScrollToTop}
        className="ssu-button-primary"
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          zIndex: 1000,
        }}
      >
        Scroll to Top
      </button>
    )
  );
};

export default ScrollToTop;
