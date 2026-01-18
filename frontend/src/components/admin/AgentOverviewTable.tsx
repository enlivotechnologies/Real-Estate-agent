interface AgentOverview {
  agentId: string;
  agentName: string;
  agentEmail: string;
  leadsToday: number;
  leadsWeek: number;
  leadsMonth: number;
  pending: number;
  completed: number;
  pendingWorks: number;
  // Performance metrics
  totalLeadsAssigned: number;
  overdueLeads: number;
  closedDeals: number;
  lostDeals: number;
  commissionClosed: number;
  commissionLost: number;
  inProgressCommission: number;
}

interface AgentOverviewTableProps {
  agents: AgentOverview[];
  onOpenOverview: (agent: AgentOverview) => void;
}

const AgentOverviewTable = ({ agents, onOpenOverview }: AgentOverviewTableProps) => {
  // Format currency to Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (agents.length === 0) {
    return (
      <div className="rounded-xl shadow-sm border border-gray-200/60 overflow-hidden" style={{ backgroundColor: '#FEFDFB' }}>
        <div className="p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="mt-4 text-sm text-gray-400">No agents found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-sm border border-gray-200/60 overflow-hidden" style={{ backgroundColor: '#FEFDFB' }}>
      <div className="px-6 py-4 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-gray-100/50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Agent Revenue Overview</h3>
        <p className="text-xs text-gray-500 mt-1">Sorted by highest lost commission, then highest closed commission</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200/60 bg-gray-50/50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Agent Name
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                Total Leads
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                Overdue
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                Closed Deals
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                Lost Deals
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                Commission Closed (₹)
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, index) => {
              const hasHighLostCommission = agent.commissionLost > 0;
              const hasOverdueLeads = agent.overdueLeads > 0;
              
              return (
                <tr 
                  key={agent.agentId} 
                  className={`border-b border-gray-100/50 transition-all duration-200 ${
                    index === agents.length - 1 ? 'border-b-0' : ''
                  } ${hasHighLostCommission ? 'bg-red-50/40' : 'hover:bg-gray-50/40'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                        hasHighLostCommission ? 'bg-red-500' : 'bg-blue-500'
                      }`}>
                        <span className="text-sm font-medium text-white">
                          {agent.agentName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{agent.agentName}</div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">{agent.agentEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-semibold text-gray-900">{agent.totalLeadsAssigned}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      hasOverdueLeads 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {agent.overdueLeads}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {agent.closedDeals}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      agent.lostDeals > 0 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {agent.lostDeals}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-bold ${
                      agent.commissionClosed > 0 ? 'text-emerald-600' : 'text-gray-500'
                    }`}>
                      {formatCurrency(agent.commissionClosed)}
                    </span>
                    {agent.commissionLost > 0 && (
                      <div className="text-xs text-red-500 mt-0.5">
                        Lost: {formatCurrency(agent.commissionLost)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenOverview(agent);
                      }}
                      className="px-3 py-1.5 bg-gradient-to-b from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white text-xs font-medium rounded-lg transition-all shadow-sm"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentOverviewTable;
export type { AgentOverview };
