// src/hooks/use-mobile.js
import { useState, useEffect } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobileStatus = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateMobileStatus();
    window.addEventListener("resize", updateMobileStatus);

    return () => {
      window.removeEventListener("resize", updateMobileStatus);
    };
  }, []);

  return isMobile;
};
