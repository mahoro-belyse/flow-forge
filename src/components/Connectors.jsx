import { useMemo } from 'react';

const NODE_W = 220; 

export default function Connectors({ nodes, selectedId }) {
  const paths = useMemo(() => {
    const list = [];
    nodes.forEach(node => {
      node.options.forEach((opt, i) => {
        const target = nodes.find(n => n.id === opt.nextId);
        if (!target) return;
        const x1 = node.x + NODE_W / 2;
        const y1 = node.y + 140; // approximate bottom of node
        const x2 = target.x + NODE_W / 2;
        const y2 = target.y;
        const cy = (y1 + y2) / 2;
        const d = `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`;
        const isActive = node.id === selectedId || target.id === selectedId;
        list.push({ d, key: `${node.id}-${opt.nextId}-${i}`, label: opt.label, mx: (x1+x2)/2, my: cy, isActive });
      });
    });
    return list;
  }, [nodes, selectedId]);

  return (
    <svg className="connectors-svg" width="3000" height="3000">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="rgba(108,99,255,0.6)" />
        </marker>
        <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="rgba(108,99,255,1)" />
        </marker>
      </defs>
      {paths.map(p => (
        <g key={p.key}>
          <path d={p.d} fill="none"
            stroke={p.isActive ? 'rgba(108,99,255,0.9)' : 'rgba(108,99,255,0.35)'}
            strokeWidth={p.isActive ? 2 : 1.5}
            strokeDasharray={p.isActive ? 'none' : '5,4'}
            markerEnd={p.isActive ? 'url(#arrow-active)' : 'url(#arrow)'}
          />
          <text x={p.mx} y={p.my - 4} textAnchor="middle" className="conn-label" fontSize="10"
            fill="rgba(122,128,160,0.8)">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}