import { useEffect, useRef, useState } from "react"

const useWindowResizeThreshold = threshold => {
  const [isSize, setIsSize] = useState(window.innerWidth <= threshold);
  const prevWidth = useRef(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const currWidth = window.innerWidth;
      if (currWidth <= threshold && prevWidth.current > threshold){
        setIsSize(true);
      } else if (currWidth > threshold && prevWidth.current <= threshold) {
        setIsSize(false);
      }
      prevWidth.current = currWidth;
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isSize;
}

export default useWindowResizeThreshold