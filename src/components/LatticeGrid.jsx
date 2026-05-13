import React, { useEffect, useRef } from "react";
import { Lattice } from "../controllers/Lattice";

export function LatticeGrid({ plots, config = {}, className, style }) {
  // shadow-DOM-safe: pass the container element directly instead of a string id
  // derived from React.useId(), which can't be resolved via document lookups
  // when the widget is rendered inside a shadow root (e.g. marimo).
  const containerRef = useRef(null);
  const latticeRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !plots || plots.length === 0) return;

    containerRef.current.innerHTML = "";

    latticeRef.current = new Lattice(plots, containerRef.current, config);
    latticeRef.current.render();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      latticeRef.current = null;
    };
  }, [plots, config]);

  return <div ref={containerRef} className={className} style={style} />;
}

export default LatticeGrid;
