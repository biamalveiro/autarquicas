import { useRef, useEffect, useState } from "react";

/* 
useChartDimensions hook from https://wattenberger.com/blog/react-hooks
 */

const combineChartDimensions = (dimensions) => {
  let parsedDimensions = {
    marginTop: 40,
    marginRight: 30,
    marginBottom: 40,
    marginLeft: 75,
    ...dimensions,
  };
  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height -
        parsedDimensions.marginTop -
        parsedDimensions.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      parsedDimensions.width -
        parsedDimensions.marginLeft -
        parsedDimensions.marginRight,
      0
    ),
  };
};

const useChartDimensions = (passedSettings) => {
  const ref = useRef();
  const initialDimensions = combineChartDimensions(passedSettings);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (initialDimensions.width && initialDimensions.height) return;

    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;
      const entry = entries[0];
      if (width !== entry.contentRect.width) setWidth(entry.contentRect.width);
      if (height !== entry.contentRect.height)
        setHeight(entry.contentRect.height);
    });

    resizeObserver.observe(element);
    return () => resizeObserver.unobserve(element);
  }, [width, height, initialDimensions.width, initialDimensions.height]);

  const dimensions = combineChartDimensions({
    ...initialDimensions,
    width: initialDimensions.width || width,
    height: initialDimensions.height || height,
  });

  return [ref, dimensions];
};

export default useChartDimensions;
