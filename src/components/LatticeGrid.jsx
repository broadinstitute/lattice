import React, { useEffect, useRef, useId } from "react";
import { Lattice } from "../controllers/Lattice";

export function LatticeGrid({ plots, config = {}, className, style }) {
  const containerRef = useRef(null);
  const latticeRef = useRef(null);
  const containerId = useId().replace(/:/g, "-");

  useEffect(() => {
    if (!containerRef.current || !plots || plots.length === 0) return;

    containerRef.current.innerHTML = "";

    latticeRef.current = new Lattice(plots, containerId, config);
    latticeRef.current.render();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      latticeRef.current = null;
    };
  }, [plots, config, containerId]);

  return (
    <div
      ref={containerRef}
      id={containerId}
      className={className}
      style={style}
    />
  );
}

export default LatticeGrid;
