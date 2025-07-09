import { Link } from 'react-router-dom';
import { CheckSquare, BarChart3, Calendar, ArrowRight, Star, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTask } from '@/contexts/TaskContext';

const Home = () => {
  const { tasks, completedTasks, pendingTasks } = useTask();

  const features = [
    {
      icon: CheckSquare,
      title: 'Smart Task Management',
      description: 'Organize your tasks with priorities, tags, and due dates for maximum productivity.'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Track your progress with beautiful charts and insights into your productivity patterns.'
    },
    {
      icon: Calendar,
      title: 'Calendar Integration',
      description: 'View your tasks in a calendar layout and never miss important deadlines.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with modern technologies for a smooth and responsive experience.'
    },
    {
      icon: Star,
      title: 'Beautiful Design',
      description: 'Enjoy a clean, modern interface that makes task management a pleasure.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data stays safe with local storage and no external dependencies.'
    }
  ];

  const stats = [
    { label: 'Total Tasks', value: tasks.length, color: 'from-blue-500 to-purple-500' },
    { label: 'Completed', value: completedTasks.length, color: 'from-green-500 to-emerald-500' },
    { label: 'Pending', value: pendingTasks.length, color: 'from-orange-500 to-red-500' },
    { 
      label: 'Completion Rate', 
      value: tasks.length > 0 ? `${Math.round((completedTasks.length / tasks.length) * 100)}%` : '0%',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 backdrop-blur-sm border border-indigo-200/20 dark:border-indigo-700/20 rounded-full px-4 py-2 mb-6">
          <Star className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Welcome to Task App</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-indigo-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
            Organize Your Life
          </span>
          <br />
          <span className="text-gray-800 dark:text-white">with Productive Tasks</span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Task App helps you stay organized and productive with intelligent task management, 
          beautiful analytics, and a seamless user experience.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/tasks">
            <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-8 py-3 text-lg font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="px-8 py-3 text-lg font-semibold border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/20">
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-white/20 dark:border-slate-700/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Stay
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Productive</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Task App combines powerful features with beautiful design to create the perfect task management experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-white/20 dark:border-slate-700/20 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-200/20 dark:border-purple-700/20 rounded-3xl p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Transform Your Productivity?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of users who have already discovered the power of organized task management with Task App.
        </p>
        <Link to="/tasks">
          <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-8 py-3 text-lg font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300">
            Start Managing Tasks
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
