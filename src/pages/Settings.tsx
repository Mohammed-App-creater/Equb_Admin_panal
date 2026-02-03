
import React from 'react';
import Card from '../components/Card';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-foreground">Settings</h2>
      
      <Card title="Profile Settings">
        <p className="text-muted-foreground mb-4">Manage your account preferences and profile information.</p>
        <div className="p-4 bg-muted rounded-xl text-center text-sm text-muted-foreground border border-border">
          Settings configuration is coming soon.
        </div>
      </Card>
      
      <Card title="App Preferences">
        <div className="flex items-center justify-between py-2 border-b border-border">
          <span className="text-sm font-medium">Email Notifications</span>
          <span className="text-sm font-bold text-primary">Enabled</span>
        </div>
        <div className="flex items-center justify-between py-2 pt-4">
          <span className="text-sm font-medium">Language</span>
          <span className="text-sm font-bold">English</span>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
