import React, { useState } from 'react';

export default function TestingPanel({ onExecute, onReset, isRunning }) {
  const [activeEndpoint, setActiveEndpoint] = useState('users');

  const scenarios = [
    {
      id: 'immediate_success',
      title: 'Immediate Success',
      desc: 'Succeeds on Attempt #1 (0 retries)',
      btnClass: 'btn-success',
      icon: '✓',
    },
    {
      id: 'fail_twice_then_succeed',
      title: 'Fail Twice, Then Recover',
      desc: 'Fails attempts 1 & 2, succeeds on 3 via retry',
      btnClass: 'btn-warning',
      icon: '↻',
    },
    {
      id: 'fail_all',
      title: 'Exhaust All Retries',
      desc: 'Fails every attempt, throws ResilixError',
      btnClass: 'btn-danger',
      icon: '✕',
    },
    {
      id: 'probabilistic',
      title: 'Probabilistic Simulation',
      desc: 'Uses configured failure probability',
      btnClass: 'btn-primary',
      icon: '⚡',
    },
  ];

  return (
    <div className="panel-box">
      <div className="panel-header">
        <h2 className="panel-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          Interactive Resilience Tester
        </h2>
        <button
          className="btn btn-subtle"
          onClick={onReset}
          disabled={isRunning}
          title="Reset all request counters and activity logs"
        >
          Reset Stats
        </button>
      </div>

      <div style={{ marginBottom: '18px' }}>
        <div className="form-label" style={{ marginBottom: '8px' }}>Select Target Service Endpoint:</div>
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
              style={{ flex: 1, fontSize: '12px', padding: '8px 12px' }}
            >
              {ep.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="form-label" style={{ marginBottom: '8px' }}>Trigger Retry Scenario:</div>
        <div className="scenario-button-grid">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => onExecute(activeEndpoint, sc.id)}
              disabled={isRunning}
              className={`btn ${sc.btnClass}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: '12px 14px',
                height: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
                <span>{sc.icon}</span>
                <span>{sc.title}</span>
              </div>
              <span style={{ fontSize: '11px', opacity: 0.85, marginTop: '4px', fontWeight: 400 }}>
                {sc.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {isRunning && (
        <div style={{
          marginTop: '12px',
          padding: '10px 14px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '12px',
          color: '#93c5fd'
        }}>
          <span className="status-dot" style={{ backgroundColor: '#3b82f6' }}></span>
          <span>Resilix is handling operation execution and backing off between retries...</span>
        </div>
      )}
    </div>
  );
}
