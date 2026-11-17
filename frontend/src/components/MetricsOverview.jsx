import React from 'react';

export default function MetricsOverview({ stats }) {
  const cards = [
    {
      label: 'Total Requests',
      value: stats?.totalRequests ?? 0,
      footer: 'All initiated API calls',
      color: 'blue',
    },
    {
      label: 'Successful Requests',
      value: stats?.successfulRequests ?? 0,
      footer: 'Completed with 200 OK',
      color: 'emerald',
    },
    {
      label: 'Failed Requests',
      value: stats?.failedRequests ?? 0,
      footer: 'Retries exhausted (503)',
      color: 'rose',
    },
    {
      label: 'Retries Triggered',
      value: stats?.totalRetries ?? 0,
      footer: 'Transient errors retried',
      color: 'amber',
    },
    {
      label: 'Recovered via Retry',
      value: stats?.successfulRecoveries ?? 0,
      footer: 'Saved from outright failure',
      color: 'cyan',
    },
    {
      label: 'Retry Success Rate',
      value: stats?.retrySuccessRate ?? '100.0%',
      footer: 'Recovery vs. exhaustion',
      color: 'emerald',
    },
    {
      label: 'Avg Attempts / Req',
      value: stats?.averageAttemptsPerRequest ?? '1.00',
      footer: 'Attempts per operation',
      color: 'purple',
    },
    {
      label: 'Avg Latency',
      value: stats?.averageResponseTime ?? '0ms',
      footer: 'Including backoff waits',
      color: 'blue',
    },
  ];

  return (
    <section className="metrics-grid">
      {cards.map((card, idx) => (
        <div key={idx} className={`metric-card ${card.color}`}>
          <div className="metric-label">{card.label}</div>
          <div className="metric-number">{card.value}</div>
          <div className="metric-footer">{card.footer}</div>
        </div>
      ))}
    </section>
  );
}
