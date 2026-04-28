import { useState, useEffect } from 'react';
import Icon from './Icon';

export default function EditPanel({ node, nodes, onUpdate, onDelete, onClose }) {
  const [q, setQ] = useState(node.question);
  const [type, setType] = useState(node.type);
  const [opts, setOpts] = useState(node.options.map(o => ({ ...o })));

 useEffect(() => {
     // eslint-disable-next-line react-hooks/set-state-in-effect
  setQ(node.question);
  setType(node.type);
  setOpts(node.options.map(o => ({ ...o })));
}, [node.id, node.question, node.type, node.options]);

  const save = () => onUpdate(node.id, { question: q, type, options: opts });
  const addOpt = () => setOpts([...opts, { label: 'New option', nextId: '' }]);
  const delOpt = i => setOpts(opts.filter((_, idx) => idx !== i));
  const setOptLabel = (i, v) => { const a = [...opts]; a[i] = { ...a[i], label: v }; setOpts(a); };
  const setOptNext = (i, v) => { const a = [...opts]; a[i] = { ...a[i], nextId: v }; setOpts(a); };

  return (
    <div className="edit-panel fade-in">
      <div className="edit-panel-header">
        <span className="edit-panel-title"><Icon name="edit" size={14} /> &nbsp;Edit Node</span>
        <button className="icon-btn" onClick={onClose}><Icon name="close" size={16} /></button>
      </div>
      <div className="edit-body">
        <div className="field-group">
          <label className="field-label">Node Type</label>
          <select className="field-select" value={type} onChange={e => setType(e.target.value)}>
            <option value="start">Start</option>
            <option value="mid">Step</option>
            <option value="end">End</option>
          </select>
        </div>
        <div className="field-group">
          <label className="field-label">Question / Message</label>
          <textarea className="field-textarea" value={q} onChange={e => setQ(e.target.value)} placeholder="Enter node message..." />
        </div>
        <div className="field-group">
          <label className="field-label">Answer Options ({opts.length})</label>
          {opts.map((o, i) => (
            <div key={i} className="option-row">
              <input value={o.label} onChange={e => setOptLabel(i, e.target.value)} placeholder="Option label..." />
              <select value={o.nextId || ''} onChange={e => setOptNext(i, e.target.value)}>
                <option value="">No link</option>
                {nodes.filter(n => n.id !== node.id).map(n => (
                  <option key={n.id} value={n.id}>{n.id}: {n.question.slice(0, 20)}...</option>
                ))}
              </select>
              <button className="icon-btn" onClick={() => delOpt(i)}><Icon name="trash" size={13} /></button>
            </div>
          ))}
          <button className="add-option-btn" onClick={addOpt}><Icon name="plus" size={12} /> Add option</button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={save}><Icon name="save" size={13} /> Save</button>
          <button className="btn btn-ghost" onClick={onClose}><Icon name="close" size={13} /> Cancel</button>
        </div>
        <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => onDelete(node.id)}>
            <Icon name="trash" size={13} /> Delete Node
          </button>
        </div>
      </div>
    </div>
  );
}