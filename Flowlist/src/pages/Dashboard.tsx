
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

const Dashboard = () => {
  const { tasks, completedTasks, pendingTasks } = useTask();

  // Calculate completion rate by day for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayTasks = tasks.filter(task => 
      task.completedAt && 
      isWithinInterval(task.completedAt, {
        start: startOfDay(date),
        end: endOfDay(date)
      })
    );
    
    return {
      date: format(date, 'MMM dd'),
      completed: dayTasks.length,
      total: tasks.filter(task => 
        task.createdAt <= date && 
        (!task.completedAt || task.completedAt >= startOfDay(date))
      ).length
    };
  });

  // Priority distribution
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' }
  ];

  // Completion statistics
  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
  const overdueTasks = pendingTasks.filter(task => 
    task.dueDate && task.dueDate < new Date()
  ).length;

  const upcomingTasks = pendingTasks.filter(task => 
    task.dueDate && 
    task.dueDate >= new Date() && 
    task.dueDate <= subDays(new Date(), -7)
  ).length;

  const stats = [
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: Target,
      color: 'from-blue-500 to-purple-500',
      description: 'All time tasks created'
    },
    {
      title: 'Completed',
      value: completedTasks.length,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      description: `${completionRate.toFixed(1)}% completion rate`
    },
    {
      title: 'Pending',
      value: pendingTasks.length,
      icon: Clock,
      color: 'from-orange-500 to-red-500',
      description: `${overdueTasks} overdue tasks`
    },
    {
      title: 'Upcoming',
      value: upcomingTasks,
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      description: 'Due in next 7 days'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your productivity and task completion trends
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-white/20 dark:border-slate-700/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Completion Trend */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-white/20 dark:border-slate-700/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />
              7-Day Completion Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-white/20 dark:border-slate-700/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-500" />
              Task Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {priorityData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Completed Tasks */}
        <Card className="lg:col-span-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-white/20 dark:border-slate-700/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Recently Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedTasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No completed tasks yet. Start checking off some tasks!
              </p>
            ) : (
              <div className="space-y-3">
                {completedTasks
                  .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
                  .slice(0, 5)
                  .map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-green-50/50 dark:bg-green-900/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{task.title}</p>
                          {task.completedAt && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Completed {format(task.completedAt, 'MMM dd, h:mm a')}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={
                          task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-white/20 dark:border-slate-700/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">Productivity Score</h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completionRate.toFixed(0)}%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Based on completion rate</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Tasks This Week</h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {last7Days.reduce((sum, day) => sum + day.completed, 0)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Completed in last 7 days</p>
            </div>

            {overdueTasks > 0 && (
              <div className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg">
                <h4 className="font-semibold text-red-700 dark:text-red-300 mb-1">Overdue Tasks</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{overdueTasks}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Need immediate attention</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
