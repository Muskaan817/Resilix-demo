import React, { useState } from 'react';

export default function TestingPanel({ onExecute, onReset, isRunning }) {
  const [activeEndpoint, setActiveEndpoint] = useState('users');

  const scenarios = [
    {
      id: 'immediate_success',
      title: 'Immediate Success',
      tag: '0 RETRIES',
      desc: 'Succeeds on Attempt #1 without delay',
      btnClass: 'btn-success',
      icon: '✓',
    },
    {
      id: 'fail_twice_then_succeed',
      title: 'Transient Failure',
      tag: 'RECOVERS',
      desc: 'Fails attempts 1 & 2, recovers on #3',
      btnClass: 'btn-warning',
      icon: '↻',
    },
    {
      id: 'fail_all',
      title: 'Persistent Outage',
      tag: 'EXHAUSTS 503',
      desc: 'Fails all retries, returns ResilixError',
      btnClass: 'btn-danger',
      icon: '✕',
    },
    {
      id: 'probabilistic',
      title: 'Probabilistic Flakiness',
      tag: 'CONFIG RATE',
      desc: 'Simulates random real-world network drops',
      btnClass: 'btn-scenario-blue',
      icon: '⚡',
    },
  ];

  return (
    <div className="panel-box">
      <div className="panel-header">
        <h2 className="panel-heading">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          Fault Injection & Testing
        </h2>
        <button
          className="btn btn-subtle"
          onClick={onReset}
          disabled={isRunning}
          title="Reset all request counters and activity logs"
        >
          Reset Metrics
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div className="form-label" style={{ marginBottom: '6px' }}>Target Service Route:</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'users', label: 'GET /users', desc: 'User profiles database' },
            { id: 'products', label: 'GET /products', desc: 'Product inventory service' },
            { id: 'orders', label: 'GET /orders', desc: 'Payment order gateway' },
          ].map((ep) => (
            <button
              key={ep.id}
              onClick={() => setActiveEndpoint(ep.id)}
              className={`btn ${activeEndpoint === ep.id ? 'btn-primary' : 'btn-subtle'}`}
              style={{ flex: 1, fontSize: '11.5px', padding: '6px 10px' }}
            >
              {ep.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="form-label" style={{ marginBottom: '6px' }}>Simulate Resilience Scenarios:</div>
        <div className="scenario-button-grid">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => onExecute(activeEndpoint, sc.id)}
              disabled={isRunning}
              className={`btn-scenario ${sc.btnClass}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, fontSize: '12.5px', color: '#f0f6fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{sc.icon}</span>
                  <span>{sc.title}</span>
                </span>
                <span style={{
                  fontSize: '9.5px',
                  fontFamily: 'var(--font-mono)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#c9d1d9',
                  letterSpacing: '0.04em'
                }}>
                  {sc.tag}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                {sc.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {isRunning && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          background: 'rgba(56, 139, 253, 0.1)',
          border: '1px solid rgba(56, 139, 253, 0.3)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11.5px',
          color: '#79c0ff',
          fontFamily: 'var(--font-mono)'
        }}>
          <span className="status-dot" style={{ backgroundColor: '#388bfd' }}></span>
          <span>Resilix retry engine in flight... backing off between attempts</span>
        </div>
      )}
    </div>
  );
}
