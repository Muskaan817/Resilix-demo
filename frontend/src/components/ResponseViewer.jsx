import React from 'react';

export default function ResponseViewer({ response }) {
  if (!response) {
    return (
      <div className="panel-box">
        <div className="panel-header">
          <h2 className="panel-heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Last API Response
          </h2>
        </div>
        <div className="empty-placeholder">
          No requests executed yet. Click one of the scenario buttons to trigger an API call.
        </div>
      </div>
    );
  }

  const { status, ok, data, durationMs, endpoint, scenario } = response;
  const is200 = status >= 200 && status < 300;

  return (
    <div className="panel-box">
      <div className="panel-header">
        <h2 className="panel-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          Last API Response
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`status-badge ${is200 ? 'healthy' : 'offline'}`} style={{ padding: '4px 10px' }}>
            HTTP {status} {is200 ? 'OK' : 'Error'}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {durationMs}ms
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '10px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '14px' }}>
        <span>Endpoint: <code style={{ color: '#fff' }}>/{endpoint}</code></span>
        <span>Scenario: <code style={{ color: '#fff' }}>{scenario}</code></span>
        {data?.attempts !== undefined && (
          <span>Attempts: <code style={{ color: 'var(--accent-blue)' }}>{data.attempts}</code></span>
        )}
        {data?.retries !== undefined && (
          <span>Retries: <code style={{ color: 'var(--accent-amber)' }}>{data.retries}</code></span>
        )}
        {data?.recoveredAfterRetry && (
          <span style={{ color: 'var(--accent-green)', fontWeight: 500 }}>[Recovered via retry]</span>
        )}
      </div>

      <pre className="code-viewer">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
