import { useState, useCallback } from 'react';
import { DEFAULT_FLOW } from '../utils/constants';

export function useFlow() {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('ff_flow');
      return [saved ? JSON.parse(saved) : DEFAULT_FLOW];
    } catch {
      return [DEFAULT_FLOW];
    }
  });
  const [histIdx, setHistIdx] = useState(0);
  const flow = history[histIdx];

  const pushFlow = useCallback((newFlow) => {
    const next = history.slice(0, histIdx + 1);
    next.push(newFlow);
    setHistory(next);
    setHistIdx(next.length - 1);
    localStorage.setItem('ff_flow', JSON.stringify(newFlow));
  }, [history, histIdx]);

  const replaceFlow = useCallback((newFlow) => {
    setHistory([newFlow]);
    setHistIdx(0);
    localStorage.setItem('ff_flow', JSON.stringify(newFlow));
  }, []);

  const undo = useCallback(() => {
    if (histIdx > 0) setHistIdx(i => i - 1);
  }, [histIdx]);

  const redo = useCallback(() => {
    if (histIdx < history.length - 1) setHistIdx(i => i + 1);
  }, [histIdx, history.length]);

  const updateNode = useCallback((id, patch) => {
    pushFlow({
      ...flow,
      nodes: flow.nodes.map(n => n.id === id ? { ...n, ...patch } : n)
    });
  }, [flow, pushFlow]);

  const deleteNode = useCallback((id) => {
    pushFlow({
      ...flow,
      nodes: flow.nodes.filter(n => n.id !== id).map(n => ({
        ...n,
        options: n.options.filter(o => o.nextId !== id)
      }))
    });
  }, [flow, pushFlow]);

  const addNode = useCallback((type) => {
    const id = 'n' + (Date.now() % 10000);
    const newNode = {
      id, type,
      question: type === 'start' ? 'New start node' : type === 'end' ? '✅ End of conversation' : 'New step question',
      x: 200 + Math.random() * 300,
      y: 100 + Math.random() * 200,
      options: type === 'end' ? [] : [{ label: 'Option 1', nextId: '' }]
    };
    pushFlow({ ...flow, nodes: [...flow.nodes, newNode] });
    return id;
  }, [flow, pushFlow]);

  const resetFlow = useCallback(() => pushFlow(DEFAULT_FLOW), [pushFlow]);

  return {
    flow,
    undo,
    redo,
    canUndo: histIdx > 0,
    canRedo: histIdx < history.length - 1,
    updateNode,
    deleteNode,
    addNode,
    resetFlow,
    replaceFlow,
    histIdx,
    historyLength: history.length
  };
}