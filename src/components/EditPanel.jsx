import { useState, useEffect } from 'react';
import Icon from './Icon';

export default function EditPanel({ node, nodes, onUpdate, onDelete, onClose }) {
  const [q, setQ] = useState(node.question);
  const [type, setType] = useState(node.type);
  const [opts, setOpts] = useState(node.options.map(o => ({ ...o })));

 
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