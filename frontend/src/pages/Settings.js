import React, { useState } from 'react';
import { Key, Database, Shield, Bell, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('api');

  const tabs = [
    { id: 'api', name: 'API Settings', icon: Key },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'help', name: 'Help', icon: HelpCircle },
  ];

  const [apiSettings, setApiSettings] = useState({
    apiKey: 'demo-api-key-12345',
    baseUrl: 'http://localhost:8080',
    timeout: 60000,
    retries: 3,
  });

  const [dbSettings, setDbSettings] = useState({
    type: 'SQLite',
    location: './enterprise_agents.db',
    backupEnabled: true,
    backupFrequency: 'daily',
  });

  const handleSaveSettings = (section) => {
    toast.success(`${section} settings saved successfully!`);
  };

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="flex space-x-2">
              <input
                type="password"
                value={apiSettings.apiKey}
                onChange={(e) => setApiSettings({ ...apiSettings, apiKey: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              <button className="btn-secondary">Regenerate</button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your API key for accessing the Enterprise Agents Platform
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base URL
            </label>
            <input
              type="text"
              value={apiSettings.baseUrl}
              onChange={(e) => setApiSettings({ ...apiSettings, baseUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout (ms)
              </label>
              <input
                type="number"
                value={apiSettings.timeout}
                onChange={(e) => setApiSettings({ ...apiSettings, timeout: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retries
              </label>
              <input
                type="number"
                value={apiSettings.retries}
                onChange={(e) => setApiSettings({ ...apiSettings, retries: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => handleSaveSettings('API')}
          className="btn-primary"
        >
          Save API Settings
        </button>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Database Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Database Type
            </label>
            <select
              value={dbSettings.type}
              onChange={(e) => setDbSettings({ ...dbSettings, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="SQLite">SQLite</option>
              <option value="PostgreSQL">PostgreSQL</option>
              <option value="MySQL">MySQL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Database Location
            </label>
            <input
              type="text"
              value={dbSettings.location}
              onChange={(e) => setDbSettings({ ...dbSettings, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Settings
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={dbSettings.backupEnabled}
                  onChange={(e) => setDbSettings({ ...dbSettings, backupEnabled: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable automatic backups</span>
              </label>
              
              {dbSettings.backupEnabled && (
                <select
                  value={dbSettings.backupFrequency}
                  onChange={(e) => setDbSettings({ ...dbSettings, backupFrequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button className="btn-secondary">Test Connection</button>
        <button 
          onClick={() => handleSaveSettings('Database')}
          className="btn-primary"
        >
          Save Database Settings
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Configuration</h3>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>This is a demo environment. In production, ensure you:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Use HTTPS for all API communications</li>
                    <li>Implement proper authentication and authorization</li>
                    <li>Regularly rotate API keys</li>
                    <li>Enable request rate limiting</li>
                    <li>Monitor for suspicious activity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={true}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable API key authentication</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={true}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable request logging</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={true}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable rate limiting</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={false}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable IP whitelisting</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => handleSaveSettings('Security')}
          className="btn-primary"
        >
          Save Security Settings
        </button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            Configure how you want to receive notifications about your agent activities.
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Email notifications</span>
                <p className="text-xs text-gray-500">Receive updates via email</p>
              </div>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Webhook notifications</span>
                <p className="text-xs text-gray-500">Send notifications to webhook URL</p>
              </div>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Agent failure alerts</span>
                <p className="text-xs text-gray-500">Get notified when agents fail</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={true}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Usage limit warnings</span>
                <p className="text-xs text-gray-500">Alert when approaching limits</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={true}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => handleSaveSettings('Notifications')}
          className="btn-primary"
        >
          Save Notification Settings
        </button>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Help & Documentation</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Getting Started</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <a href="#" className="text-primary-600 hover:text-primary-800">Quick Start Guide</a></li>
              <li>• <a href="#" className="text-primary-600 hover:text-primary-800">API Documentation</a></li>
              <li>• <a href="#" className="text-primary-600 hover:text-primary-800">Agent Configuration</a></li>
              <li>• <a href="#" className="text-primary-600 hover:text-primary-800">Best Practices</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Troubleshooting</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <a href="#" className="text-primary-600 hover:text-primary-800">Common Issues</a></li>
              <li>• <a href="#" className="text-primary-600 hover:text-primary-800">Error Codes</a></li>
              <li>• <a href="#" className="text-primary-600 hover:text-primary-800">Performance Tips</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Support</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                For additional support, please contact:
              </p>
              <p className="text-sm font-medium text-gray-900">
                Email: support@enterprise-agents.com
              </p>
              <p className="text-sm font-medium text-gray-900">
                Documentation: docs.enterprise-agents.com
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">System Information</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-gray-700">Version</dt>
                  <dd className="text-gray-600">2.0.0</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">API Version</dt>
                  <dd className="text-gray-600">v2.0.0</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Last Updated</dt>
                  <dd className="text-gray-600">2026-01-31</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">License</dt>
                  <dd className="text-gray-600">Enterprise</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'api':
        return renderApiSettings();
      case 'database':
        return renderDatabaseSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotifications();
      case 'help':
        return renderHelp();
      default:
        return renderApiSettings();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      
      <div className="flex space-x-8">
        {/* Sidebar */}
        <div className="w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
