import { useState, useEffect, useCallback } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [search, setSearch] = useState('');
  const [showHelp, setShowHelp] = useState(() => !localStorage.getItem('ff_seen'));
  const [saved, setSaved] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('ff_theme') || 'dark');
  const [isMobile, setIsMobile] = useState(false);

  const nodes = flow.nodes;
  const editNode = nodes.find(n => n.id === editId);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On desktop, sidebar open by default; on mobile, closed
      if (!mobile) setSidebarOpen(true);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ff_theme', theme);
  }, [theme]);

  
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
    if (isMobile) setSidebarOpen(false);
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

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
      if (e.key === 'Escape') { setEditId(null); setSelectedId(null); setSidebarOpen(false); }
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

  const handleNodeEdit = (id) => {
    setEditId(id);
    if (isMobile) setSidebarOpen(false);
  };

  const handleNodeSelect = (id) => {
    setSelectedId(id);
    setEditId(id);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div id="app">
      
      <div className="topbar">
        
        <div className="logo">
          <div className="logo-icon"><Icon name="bolt" size={16} /></div>
          <span className="logo-text">Flow<span>Forge</span></span>
        </div>

        <div className="topbar-divider" />
        <button className={`chip ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(s => !s)} title="Toggle sidebar">
          <Icon name="list" size={12} />
          <span className="chip-label">Nodes</span>
        </button>

        <button className="chip hide-xs" onClick={resetFlow} title="Reset to default">
          <Icon name="restart" size={12} />
          <span className="chip-label">Reset</span>
        </button>

        <div className="topbar-sep" />

        <span className="save-status">
          {saved
            ? <><Icon name="check" size={11} /><span className="save-label">Saved</span></>
            : <span style={{ color: 'var(--accent)' }}>Saving…</span>
          }
        </span>

        
        <span className="history-badge hide-sm">{histIdx + 1}/{historyLength}</span>

        <button className="btn btn-ghost icon-only" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          <Icon name="undo" size={13} />
        </button>
        <button className="btn btn-ghost icon-only" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
          <Icon name="redo" size={13} />
        </button>

        
        <label className="btn btn-ghost icon-only hide-sm" style={{ cursor: 'pointer' }} title="Import JSON">
          <Icon name="upload" size={13} />
          <input type="file" accept=".json" style={{ display: 'none' }} onChange={importFlow} />
        </label>
        <button className="btn btn-ghost icon-only hide-sm" onClick={exportFlow} title="Export JSON">
          <Icon name="download" size={13} />
        </button>

        <button className="btn btn-ghost icon-only" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} title="Toggle theme">
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={14} />
        </button>

        
        <button className="btn btn-primary preview-btn" onClick={() => { setPreview(true); localStorage.setItem('ff_seen', '1'); setShowHelp(false); }}>
          <Icon name="play" size={13} />
          <span className="preview-label">Preview</span>
        </button>
      </div>

    
      <div className="main">

        
        {isMobile && sidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}

        
        <div className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'} ${isMobile ? 'sidebar-mobile' : ''}`}>
          <div className="sidebar-header">
            <span><Icon name="list" size={13} /> Flow Nodes</span>
            {isMobile && (
              <button className="icon-btn" onClick={() => setSidebarOpen(false)}>
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
          <div className="sidebar-body">
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <div className="search-input-wrap" style={{ width: '100%', boxShadow: 'none', position: 'static', transform: 'none' }}>
                <span className="search-icon"><Icon name="search" size={13} /></span>
                <input placeholder="Search nodes…" value={search} onChange={e => setSearch(e.target.value)} />
                {search && <button className="icon-btn" onClick={() => setSearch('')}><Icon name="close" size={12} /></button>}
              </div>
            </div>
            {filteredNodes.map(n => (
              <div key={n.id} className={`node-list-item ${selectedId === n.id ? 'selected' : ''}`}
                onClick={() => handleNodeSelect(n.id)}>
                <div className="node-dot" style={{ background: n.type === 'start' ? 'var(--accent)' : n.type === 'end' ? 'var(--accent2)' : 'var(--accent3)' }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div className="node-list-label">{n.question.slice(0, 32)}{n.question.length > 32 ? '…' : ''}</div>
                  <div className="node-list-type">{n.id} · {n.type} · {n.options.length} opts</div>
                </div>
              </div>
            ))}
            {filteredNodes.length === 0 && (
              <div style={{ color: 'var(--muted)', fontSize: 12, textAlign: 'center', padding: 20 }}>No nodes found</div>
            )}
          </div>
          <div className="palette">
            <div className="palette-title">Add Node</div>
            <button className="palette-btn" onClick={() => handleAddNode('start')}><span style={{ color: 'var(--accent)' }}>⬤</span> Start Node</button>
            <button className="palette-btn" onClick={() => handleAddNode('mid')}><span style={{ color: 'var(--accent3)' }}>⬤</span> Step Node</button>
            <button className="palette-btn" onClick={() => handleAddNode('end')}><span style={{ color: 'var(--accent2)' }}>⬤</span> End Node</button>
          </div>
        </div>

        
        <div className="canvas-wrap" ref={canvasRef} onMouseDown={handleCanvasMouseDown}>
          <div className="canvas-grid" />
          <div className="canvas-inner" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
            <Connectors nodes={nodes} selectedId={selectedId} />
            {nodes.map(n => (
              <NodeCard key={n.id} node={n} selected={selectedId === n.id}
                onSelect={setSelectedId} onDrag={handleDrag} onEdit={handleNodeEdit} />
            ))}
          </div>

          
          <div className="zoom-controls">
            <button className="zoom-btn" onClick={() => setZoom(z => Math.min(2, z + 0.1))} title="Zoom in"><Icon name="zoomin" size={15} /></button>
            <div className="zoom-level">{Math.round(zoom * 100)}%</div>
            <button className="zoom-btn" onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} title="Zoom out"><Icon name="zoomout" size={15} /></button>
            <button className="zoom-btn" onClick={fitView} title="Fit view"><Icon name="fit" size={15} /></button>
          </div>

          
          <div className="stats-bar">
            <div className="stat-item"><div className="stat-dot" style={{ background: 'var(--accent)' }} /><span className="stat-label">{counts.start} start</span></div>
            <div className="stat-item"><div className="stat-dot" style={{ background: 'var(--accent3)' }} /><span className="stat-label">{counts.mid} steps</span></div>
            <div className="stat-item"><div className="stat-dot" style={{ background: 'var(--accent2)' }} /><span className="stat-label">{counts.end} ends</span></div>
            <div className="stat-item" style={{ color: 'var(--text)' }}>{nodes.length} total</div>
          </div>

          
          {showHelp && (
            <div className="onboard-tip-wrap">
              <div className="onboard-tip">
                💡 Drag nodes to reposition · Double-click to edit · Ctrl+Z to undo
                <button className="icon-btn" style={{ marginLeft: 10, color: '#fff', pointerEvents: 'auto' }}
                  onClick={() => { setShowHelp(false); localStorage.setItem('ff_seen', '1'); }}>
                  <Icon name="close" size={12} />
                </button>
              </div>
            </div>
          )}

          
          {isMobile && !sidebarOpen && (
            <button className="fab-sidebar" onClick={() => setSidebarOpen(true)} title="Open nodes panel">
              <Icon name="list" size={18} />
            </button>
          )}
        </div>

        
        {editNode && (
          <div className={`edit-panel-wrap ${isMobile ? 'edit-panel-sheet' : ''}`}>
            {isMobile && <div className="sheet-handle" />}
            <EditPanel node={editNode} nodes={nodes}
              onUpdate={handleUpdate} onDelete={handleDelete}
              onClose={() => setEditId(null)} />
          </div>
        )}
      </div>

      
      {preview && <PreviewMode nodes={nodes} onClose={() => setPreview(false)} />}
    </div>
  );
}

export default App;