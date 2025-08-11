import { useEffect, useRef, useState } from "react"

const useWindowResizeThreshold = threshold => {
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth <= threshold);
  const prevWidth = useRef(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const currWidth = window.innerWidth;
      if (currWidth <= threshold && prevWidth.current > threshold){
        setIsMobileSize(true);
      } else if (currWidth > threshold && prevWidth.current <= threshold) {
        setIsMobileSize(false);
      }
      prevWidth.current = currWidth;
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobileSize;
}

export default useWindowResizeThreshold