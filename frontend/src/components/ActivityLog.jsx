import React, { useState } from 'react';

export default function ActivityLog({ logs }) {
  const [filter, setFilter] = useState('ALL');

  const filteredLogs = logs.filter((log) => {
    if (filter === 'ALL') return true;
    if (filter === 'RETRYING') return log.status === 'RETRYING';
    if (filter === 'RECOVERED') return log.status === 'RETRIED_SUCCESS';
    if (filter === 'FAILED') return log.status === 'FAILED';
    return true;
  });

  return (
    <div className="panel-box">
      <div className="panel-header">
        <h2 className="panel-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          Live Activity & Retry Stream
        </h2>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'RETRYING', 'RECOVERED', 'FAILED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`btn btn-subtle ${filter === tab ? 'active' : ''}`}
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderColor: filter === tab ? 'var(--accent-blue)' : 'var(--border-hairline)',
                color: filter === tab ? '#ffffff' : 'var(--text-secondary)',
                background: filter === tab ? 'rgba(56, 139, 253, 0.15)' : 'transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="log-container">
        {filteredLogs.length === 0 ? (
          <div className="empty-placeholder">
            No activity logged yet. Trigger an endpoint in the testing panel to see retry events.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const timeStr = log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '';
            return (
              <div key={log.id} className={`log-row ${log.status}`}>
                <span className="log-timestamp">{timeStr}</span>
                <span className={`log-tag ${log.status}`}>
                  {log.status === 'RETRIED_SUCCESS' ? 'RECOVERED' : log.status}
                </span>
                <span className="log-text">{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
