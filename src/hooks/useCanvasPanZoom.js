import { useState, useRef, useEffect, useCallback } from 'react';

export function useCanvasPanZoom() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const canvasRef = useRef(null);
  const isPanning = useRef(false);
  const panStart = useRef(null);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(z => Math.min(2, Math.max(0.3, z - e.deltaY * 0.001)));
  }, []);

  const handleCanvasMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-grid')) {
      isPanning.current = true;
      panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  }, [pan.x, pan.y]);

  useEffect(() => {
    const move = e => {
      if (isPanning.current) {
        setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
      }
    };
    const up = () => { isPanning.current = false; };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el?.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const fitView = useCallback(() => {
    setZoom(0.75);
    setPan({ x: 60, y: 40 });
  }, []);

  return {
    canvasRef,
    zoom,
    pan,
    setZoom,
    setPan,
    handleCanvasMouseDown,
    fitView
  };
}