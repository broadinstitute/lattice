import React, { useEffect, useRef, useId, useState, useMemo } from "react";
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
  const autoWidth = config.width === undefined || config.width === "auto";
  const [measuredWidth, setMeasuredWidth] = useState(null);

  // full width
  useEffect(() => {
    if (!autoWidth || !containerRef.current) return;
    let debounceTimer;
    const ro = new ResizeObserver(([entry]) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const w = Math.floor(entry.contentRect.width);
        if (w > 0) setMeasuredWidth(w);
      }, 100);
    });
    ro.observe(containerRef.current);
    return () => {
      clearTimeout(debounceTimer);
      ro.disconnect();
    };
  }, [autoWidth]);

  // merge calculated width into config
  const effectiveConfig = useMemo(() => {
    if (!autoWidth) return config;
    if (measuredWidth === null) return null;
    const { width: _, ...rest } = config;
    return { ...rest, width: measuredWidth };
  }, [config, autoWidth, measuredWidth]);

  useEffect(() => {
    if (!containerRef.current || !data || !type || !effectiveConfig) return;

    // Clear previous render
    containerRef.current.innerHTML = "";

    // Create and render the plot
    plotRef.current = new Plot(data, type, containerId, effectiveConfig);
    plotRef.current.render();

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      plotRef.current = null;
    };
  }, [data, type, effectiveConfig, containerId]);

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
