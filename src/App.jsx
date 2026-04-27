import  { useState, useEffect,useCallback } from 'react';
import { useFlow } from './hooks/useFlow';
import { useCanvasPanZoom } from './hooks/useCanvasPanZoom';
import { useToast } from './components/Toast';
import Icon from './components/Icon';
import NodeCard from './components/NodeCard';
import Connectors from './components/Connectors';
import EditPanel from './components/EditPanel';
import PreviewMode from './components/PreviewMode';

function App() {
  const toast = useToast();
  const { 
    flow, undo, redo, canUndo, canRedo, 
    updateNode, deleteNode, addNode, resetFlow, replaceFlow,
    histIdx, historyLength 
  } = useFlow();
  const { canvasRef, zoom, pan, setZoom, handleCanvasMouseDown, fitView } = useCanvasPanZoom();

  const [selectedId, setSelectedId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [showHelp, setShowHelp] = useState(() => !localStorage.getItem('ff_seen'));
  const [saved, setSaved] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('ff_theme') || 'dark');

  const nodes = flow.nodes;
  const editNode = nodes.find(n => n.id === editId);

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ff_theme', theme);
  }, [theme]);

  // Auto-save indicator (visual only, actual save is in pushFlow)
 useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setSaved(false);
  const t = setTimeout(() => setSaved(true), 500);
  return () => clearTimeout(t);
}, [flow]);


  const handleDrag = (id, x, y) => {
    updateNode(id, { x: Math.max(0, x), y: Math.max(0, y) });
  };

  const handleUpdate = (id, patch) => {
    updateNode(id, patch);
    toast('Node updated', 'success');
  };

 const handleDelete = useCallback((id) => {
  deleteNode(id);
  setEditId(null);
  setSelectedId(null);
  toast('Node deleted', 'error');
}, [deleteNode, toast]);

  const handleAddNode = (type) => {
    const newId = addNode(type);
    setEditId(newId);
    toast(`Added ${type} node`, 'info');
  };

  const exportFlow = () => {
    const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'flowforge_export.json';
    a.click();
    toast('Flow exported!', 'success');
  };

  const importFlow = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        replaceFlow(data);
        setSelectedId(null);
        setEditId(null);
        toast('Flow imported!', 'success');
      } catch {
        toast('Invalid JSON file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
      if (e.key === 'Escape') { setEditId(null); setSelectedId(null); }
      if (e.key === 'Delete' && selectedId && !editId) handleDelete(selectedId);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedId, editId, undo, redo, handleDelete]);

  const filteredNodes = search 
    ? nodes.filter(n => n.question.toLowerCase().includes(search.toLowerCase()) || n.id.includes(search)) 
    : nodes;
  const counts = {
    start: nodes.filter(n => n.type === 'start').length,
    mid: nodes.filter(n => n.type === 'mid').length,
    end: nodes.filter(n => n.type === 'end').length
  };

  return (
    <div id="app">
      {/* Top Bar */}
      <div className="topbar">
        <div className="logo">
          <div className="logo-icon"><Icon name="bolt" size={16} /></div>
          Flow<span>Forge</span>
        </div>
        <div style={{ width: 1, height: 24, background: 'var(--border2)', margin: '0 4px' }} />
        <button className="chip" onClick={() => setSidebarOpen(s => !s)} title="Toggle sidebar">
          <Icon name="list" size={12} /> Nodes
        </button>
        <button className="chip" onClick={resetFlow} title="Reset to default">
          <Icon name="restart" size={12} /> Reset
        </button>
        <div className="topbar-sep" />
        <span style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
          {saved ? <><Icon name="check" size={11} /> Saved</> : <span style={{ color: 'var(--accent)' }}>Saving…</span>}
        </span>
        <span className="history-badge">{histIdx + 1}/{historyLength}</span>
        <button className="btn btn-ghost" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)"><Icon name="undo" size={13} /></button>
        <button className="btn btn-ghost" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)"><Icon name="redo" size={13} /></button>
        <label className="btn btn-ghost" style={{ cursor: 'pointer' }} title="Import JSON">
          <Icon name="upload" size={13} />
          <input type="file" accept=".json" style={{ display: 'none' }} onChange={importFlow} />
        </label>
        <button className="btn btn-ghost" onClick={exportFlow} title="Export JSON"><Icon name="download" size={13} /></button>
        <button className="btn btn-ghost" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} title="Toggle theme">
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={14} />
        </button>
        <button className="btn btn-primary" onClick={() => { setPreview(true); localStorage.setItem('ff_seen', '1'); setShowHelp(false); }}>
          <Icon name="play" size={13} /> Preview
        </button>
      </div>

     