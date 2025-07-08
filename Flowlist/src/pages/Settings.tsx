import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Moon, Sun, Bell, User, Download, Upload, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTask } from '@/contexts/TaskContext';
import { toast } from 'sonner';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { tasks } = useTask();

  const handleExportData = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flowlist-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Tasks exported successfully!');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target?.result as string);
        localStorage.setItem('flowlist-tasks', JSON.stringify(importedTasks));
        toast.success('Tasks imported successfully! Please refresh the page.');
      } catch (error) {
        toast.error('Invalid file format. Please select a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
      localStorage.removeItem('flowlist-tasks');
      toast.success('All tasks cleared! Please refresh the page.');
    }
  };

  const settingsSections = [
    {
      title: 'Appearance',
      icon: isDark ? Moon : Sun,
      items: [
        {
          label: 'Dark Mode',
          description: 'Toggle between light and dark theme',
          control: (
            <Switch
              checked={isDark}
              onCheckedChange={toggleTheme}
            />
          )
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Task Reminders',
          description: 'Get notified about upcoming due dates',
          control: <Switch defaultChecked={false} />
        },
        {
          label: 'Daily Summary',
          description: 'Receive daily productivity summaries',
          control: <Switch defaultChecked={true} />
        },
        {
          label: 'Achievement Notifications',
          description: 'Celebrate when you complete milestones',
          control: <Switch defaultChecked={true} />
        }
      ]
    },
    {
      title: 'Account',
      icon: User,
      items: [
        {
          label: 'Display Name',
          description: 'How others see your name',
          control: (
            <Input
              defaultValue="Task User"
              className="w-48 bg-white/50 dark:bg-slate-800/50"
            />
          )
        },
        {
          label: 'Email',
          description: 'Your account email address',
          control: (
            <Input
              defaultValue="user@taskapp.com"
              className="w-48 bg-white/50 dark:bg-slate-800/50"
            />
          )
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Customize your FlowList experience
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, index) => (
          <Card key={index} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-white/20 dark:border-slate-700/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <section.icon className="h-5 w-5 mr-2" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">{item.label}</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    {item.control}
                  </div>
                  {itemIndex < section.items.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Data Management */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-white/20 dark:border-slate-700/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Export Tasks</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download all your tasks as a JSON file
                  </p>
                </div>
                <Button 
                  onClick={handleExportData}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
              <Separator />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Import Tasks</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload a JSON file to restore your tasks
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                    id="import-file"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => document.getElementById('import-file')?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Import</span>
                  </Button>
                </div>
              </div>
              <Separator />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium text-red-600 dark:text-red-400">
                    Clear All Data
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permanently delete all tasks and settings
                  </p>
                </div>
                <Button 
                  onClick={handleClearAllData}
                  variant="destructive"
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-white/20 dark:border-slate-700/20">
          <CardHeader>
            <CardTitle>About Task App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Version</span>
              <Badge variant="secondary">1.0.0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Tasks</span>
              <Badge variant="secondary">{tasks.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Storage Used</span>
              <Badge variant="secondary">
                {(JSON.stringify(tasks).length / 1024).toFixed(2)} KB
              </Badge>
            </div>
            
            <Separator />
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Built with React, TypeScript, and Tailwind CSS
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                A modern productivity dashboard for your tasks
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
