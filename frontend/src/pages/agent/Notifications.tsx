import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { worksAPI } from '../../services/api';
import { Work } from '../../types';

interface WorkStats {
  totalWorks: number;
  completedWorks: number;
  pendingWorks: number;
  worksDueToday: number;
  recentCompletedWorks: Work[];
  pendingWorksList: Work[];
}

const Notifications = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [workStats, setWorkStats] = useState<WorkStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completingWorkId, setCompletingWorkId] = useState<string | null>(null);

  const fetchWorkStats = async () => {
    try {
      const stats = await worksAPI.getWorkStats();
      setWorkStats(stats);
    } catch (error) {
      console.error('Failed to fetch work stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCompleteWork = async (workId: string) => {
    setCompletingWorkId(workId);
    try {
      await worksAPI.completeWork(workId);
      await fetchWorkStats();
    } catch (error) {
      console.error('Failed to complete work:', error);
      alert('Failed to mark work as completed');
    } finally {
      setCompletingWorkId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/agent')}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">Notifications</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/agent')}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Today's Calls
              </button>
              <button
                onClick={() => navigate('/agent/leads')}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                All Leads
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Logout"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Closed Deals */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-green-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Closed Deals</div>
                <div className="text-2xl font-bold text-green-600">{workStats?.completedWorks || 0}</div>
              </div>
            </div>
          </div>

          {/* In Progress - RED */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-red-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">In Progress</div>
                <div className="text-2xl font-bold text-red-600">{workStats?.pendingWorks || 0}</div>
              </div>
            </div>
          </div>

          {/* Due Today */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-yellow-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Due Today</div>
                <div className="text-2xl font-bold text-yellow-600">{workStats?.worksDueToday || 0}</div>
              </div>
            </div>
          </div>

          {/* Total Works */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Works</div>
                <div className="text-2xl font-bold text-blue-600">{workStats?.totalWorks || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* In Progress Section (RED) */}
        {workStats && workStats.pendingWorksList.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
              In Progress ({workStats.pendingWorksList.length})
            </h2>
            <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-red-100 bg-red-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-red-700 uppercase tracking-wider">Lead</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-red-700 uppercase tracking-wider">Work</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-red-700 uppercase tracking-wider">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-red-700 uppercase tracking-wider">Overdue</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-red-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {workStats.pendingWorksList.map((work) => {
                    const daysOverdue = getDaysOverdue(work.dueDate);
                    return (
                      <tr key={work.id} className="hover:bg-red-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-sm">
                              <span className="text-sm font-semibold text-white">
                                {work.lead?.name?.charAt(0).toUpperCase() || '?'}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{work.lead?.name || 'Unknown'}</div>
                              <div className="text-xs text-gray-500">{work.lead?.phone || '-'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-700">{work.title}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-red-600 font-medium">{formatDate(work.dueDate)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} overdue
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleCompleteWork(work.id)}
                            disabled={completingWorkId === work.id}
                            className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                          >
                            {completingWorkId === work.id ? 'Marking...' : 'Mark Complete'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Closed Deals Section */}
        {workStats && workStats.recentCompletedWorks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
              Recent Closed Deals ({workStats.recentCompletedWorks.length})
            </h2>
            <div className="bg-white rounded-xl border border-green-200 overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-green-100 bg-green-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Lead</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Work</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Completed On</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-100">
                  {workStats.recentCompletedWorks.map((work) => (
                    <tr key={work.id} className="hover:bg-green-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-sm">
                            <span className="text-sm font-semibold text-white">
                              {work.lead?.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{work.lead?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{work.lead?.phone || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">{work.title}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">{work.completedAt ? formatDate(work.completedAt) : '-'}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {workStats && workStats.pendingWorksList.length === 0 && workStats.recentCompletedWorks.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No work notifications</h3>
            <p className="mt-2 text-sm text-gray-500">You're all caught up! No pending works at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
