import  { useRef } from 'react';
import Icon from './Icon';

export default function NodeCard({ node, selected, onSelect, onDrag, onEdit }) {
  const dragRef = useRef(null);
  const handleMouseDown = e => {
    if (e.target.tagName === 'BUTTON') return;
    e.stopPropagation();
    onSelect(node.id);
    const startX = e.clientX - node.x * (dragRef.current?.scale || 1);
    const startY = e.clientY - node.y * (dragRef.current?.scale || 1);
    dragRef.current = { startX, startY };
    const move = ev => {
      const scale = 1;
      onDrag(node.id, (ev.clientX - dragRef.current.startX) / scale,
                       (ev.clientY - dragRef.current.startY) / scale);
    };
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  const typeColor = { start: '#6c63ff', mid: '#43e97b', end: '#ff6584' };
  const typeLabel = { start: 'Start', mid: 'Step', end: 'End' };
  const badgeClass = { start: 'badge-start', mid: 'badge-mid', end: 'badge-end' };
  return (
    <div
      className={`node-card type-${node.type} ${selected ? 'selected' : ''}`}
      style={{ left: node.x, top: node.y }}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => onEdit(node.id)}
    >
      <div className="drag-handle"><Icon name="drag" size={12} /></div>
      <div className="node-header">
        <span className={`node-type-badge ${badgeClass[node.type]}`}>{typeLabel[node.type]}</span>
        <span className="node-id">{node.id}</span>
      </div>
      <div className="node-body">
        <div className="node-question">{node.question}</div>
        {node.options.length > 0 && (
          <div className="node-options">
            {node.options.slice(0, 3).map((o, i) => (
              <div key={i} className="node-option">
                <div className="node-option-dot" style={{ background: typeColor[node.type] }} />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.label}</span>
                {o.nextId && <span style={{ fontSize: 9, color: 'var(--muted)' }}>→ {o.nextId}</span>}
              </div>
            ))}
            {node.options.length > 3 && <div style={{ fontSize: 11, color: 'var(--muted)', paddingLeft: 8 }}>+{node.options.length - 3} more</div>}
          </div>
        )}
      </div>
      <div className="node-handle" />
    </div>
  );
}