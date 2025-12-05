import React, { useEffect, useRef, useId } from "react";
import { Plot } from "../controllers/Plot";

/**
 * LatticePlot - A lightweight React wrapper for Lattice plots
 *
 * @param {Object} props
 * @param {Array} props.data - Array of data points (e.g. Point2D objects or plain objects)
 * @param {string} props.type - Plot type from PlotType enum
 * @param {Object} props.config - Optional plot configuration (PlotKernel options)
 * @param {string} props.className - Optional CSS class for the container
 * @param {Object} props.style - Optional inline styles for the container
 */
export function LatticePlot({ data, type, config = {}, className, style }) {
  const containerRef = useRef(null);
  const plotRef = useRef(null);
  const containerId = useId().replace(/:/g, "-");

  useEffect(() => {
    if (!containerRef.current || !data || !type) return;

    // Clear previous render
    containerRef.current.innerHTML = "";

    // Create and render the plot
    plotRef.current = new Plot(data, type, containerId, config);
    plotRef.current.render();

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      plotRef.current = null;
    };
  }, [data, type, config, containerId]);

  return (
    <div
      ref={containerRef}
      id={containerId}
      className={className}
      style={style}
    />
  );
}

export default LatticePlot;
