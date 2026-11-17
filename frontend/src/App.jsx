import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MetricsOverview from './components/MetricsOverview';
import TestingPanel from './components/TestingPanel';
import ConfigPanel from './components/ConfigPanel';
import ActivityLog from './components/ActivityLog';
import ResponseViewer from './components/ResponseViewer';
import {
  fetchStats,
  fetchHealth,
  fetchUsers,
  fetchProducts,
  fetchOrders,
  updateConfig,
  resetStats,
} from './services/api';

export default function App() {
  const [stats, setStats] = useState(null);
  const [isHealthy, setIsHealthy] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);

  const loadHealthAndStats = useCallback(async () => {
    try {
      const [healthData, statsData] = await Promise.all([
        fetchHealth().catch(() => null),
        fetchStats().catch(() => null),
      ]);
      setIsHealthy(Boolean(healthData && healthData.status === 'ok'));
      if (statsData) {
        setStats(statsData);
      }
    } catch {
      setIsHealthy(false);
    }
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await loadHealthAndStats();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadHealthAndStats();
    const timer = setInterval(loadHealthAndStats, 2000);
    return () => clearInterval(timer);
  }, [loadHealthAndStats]);

  const handleExecuteScenario = async (endpoint, scenario) => {
    setIsRunning(true);
    const start = performance.now();
    try {
      let result;
      if (endpoint === 'users') {
        result = await fetchUsers(scenario);
      } else if (endpoint === 'products') {
        result = await fetchProducts(scenario);
      } else if (endpoint === 'orders') {
        result = await fetchOrders(scenario);
      } else {
        result = await fetchUsers(scenario);
      }

      const durationMs = Math.round(performance.now() - start);
      setLastResponse({
        endpoint,
        scenario,
        durationMs,
        status: result.status,
        ok: result.ok,
        data: result.data,
      });

      // Refresh stats right away to reflect immediate counters
      await loadHealthAndStats();
    } catch (err) {
      const durationMs = Math.round(performance.now() - start);
      setLastResponse({
        endpoint,
        scenario,
        durationMs,
        status: 500,
        ok: false,
        data: { error: err.message },
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = async () => {
    setIsRunning(true);
    try {
      const newStats = await resetStats();
      setStats(newStats);
      setLastResponse(null);
    } catch (err) {
      console.error('Failed to reset stats:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleUpdateConfig = async (newConfig) => {
    setIsUpdating(true);
    try {
      const res = await updateConfig(newConfig);
      await loadHealthAndStats();
      return res;
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Header
        isHealthy={isHealthy}
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
      />

      <MetricsOverview stats={stats} />

      <div className="grid-2col">
        <TestingPanel
          onExecute={handleExecuteScenario}
          onReset={handleReset}
          isRunning={isRunning}
        />
        <ConfigPanel
          currentConfig={stats?.config}
          onUpdateConfig={handleUpdateConfig}
          isUpdating={isUpdating}
        />
      </div>

      <div className="grid-2col">
        <ActivityLog logs={stats?.recentLogs || []} />
        <ResponseViewer response={lastResponse} />
      </div>
    </div>
  );
}
