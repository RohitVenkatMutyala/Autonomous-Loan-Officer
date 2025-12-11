import React from 'react';
import './Dashboard.css';

const Dashboard = ({ data }) => {
  // Define our 4 Agents
  const agents = ['SALES', 'VERIFICATION', 'UNDERWRITING', 'SANCTION'];

  if (!data || !data.show) {
    return (
      <div className="dashboard-container">
        <div className="empty-dashboard">
          <h3>System Idle</h3>
          <p>Start a chat to initialize agents.</p>
        </div>
      </div>
    );
  }

  const activeAgent = data.agent; // e.g., "SALES"

  return (
    <div className="dashboard-container">
      <h4 className="dashboard-title">Live Agent Execution</h4>
      
      <div className="agent-grid">
        {agents.map((agentName) => {
          const isActive = activeAgent === agentName;
          
          return (
            <div key={agentName} className={`agent-card ${isActive ? 'active' : ''}`}>
              <div className="agent-header">
                <span className="agent-name">
                  {agentName === 'SALES' && '🗣️ Sales Agent'}
                  {agentName === 'VERIFICATION' && '🔐 Verification Agent'}
                  {agentName === 'UNDERWRITING' && '🧠 Underwriting Agent'}
                  {agentName === 'SANCTION' && '📄 Sanction Agent'}
                </span>
                {isActive && <span className="agent-status">● PROCESSING</span>}
              </div>

              {/* Show Logs ONLY if this agent is active */}
              {isActive && data.logs && (
                <div className="agent-logs">
                  {data.logs.map((log, i) => (
                    <div key={i} className="log-line">{log}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;