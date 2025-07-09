
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';
import TaskDialog from '@/components/TaskDialog';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

const Calendar = () => {
  const { tasks } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad the start of the month to make sure the calendar starts on Sunday
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());

  // Generate calendar days (42 days = 6 weeks)
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && 
      isSameDay(task.dueDate, date)
    );
  };

  const getTasksForSelectedDate = () => {
    if (!selectedDate) return [];
    return getTasksForDate(selectedDate);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-300">
            View your tasks in calendar format
          </p>
        </div>
        
        <Button 
          onClick={() => setIsTaskDialogOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/25"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <Card className="lg:col-span-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-white/20 dark:border-slate-700/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                {format(currentDate, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="hover:bg-white/20 dark:hover:bg-slate-800/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="hover:bg-white/20 dark:hover:bg-slate-800/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                const tasksForDay = getTasksForDate(date);
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isCurrentDay = isToday(date);

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      p-2 min-h-[80px] text-left border border-transparent rounded-lg transition-all duration-200 hover:bg-white/50 dark:hover:bg-slate-800/50
                      ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-white'}
                      ${isSelected ? 'bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700' : ''}
                      ${isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}
                    `}
                  >
                    <div className={`text-sm font-medium mb-1 ${isCurrentDay ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                      {format(date, 'd')}
                    </div>
                    <div className="space-y-1">
                      {tasksForDay.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 rounded truncate ${
                            task.completed 
                              ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 line-through'
                              : priorityColors[task.priority]
                          }`}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                      {tasksForDay.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{tasksForDay.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Tasks */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-white/20 dark:border-slate-700/20">
          <CardHeader>
            <CardTitle>
              {selectedDate 
                ? format(selectedDate, 'EEEE, MMM dd')
                : 'Select a date'
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="space-y-4">
                {getTasksForSelectedDate().length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No tasks for this date
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setIsTaskDialogOpen(true)}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getTasksForSelectedDate().map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg border ${
                          task.completed
                            ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-medium ${
                            task.completed 
                              ? 'text-gray-500 dark:text-gray-400 line-through' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {task.title}
                          </h4>
                          <Badge className={priorityColors[task.priority]}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className={`text-sm ${
                            task.completed 
                              ? 'text-gray-400 dark:text-gray-500 line-through' 
                              : 'text-gray-600 dark:text-gray-300'
                          }`}>
                            {task.description}
                          </p>
                        )}
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {task.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Click on a date to view tasks
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TaskDialog 
        open={isTaskDialogOpen} 
        onClose={() => setIsTaskDialogOpen(false)}
      />
    </div>
  );
};

export default Calendar;
