
import React, { useState, useEffect } from 'react';

export const Settings = () => {
  const [linkedinClientId, setLinkedinClientId] = useState('');
  const [linkedinClientSecret, setLinkedinClientSecret] = useState('');
  const [aiProvider, setAiProvider] = useState('gemini'); // 'gemini' | 'local'
  const [localApiUrl, setLocalApiUrl] = useState('http://localhost:11434/v1');
  const [emailProvider, setEmailProvider] = useState('gmail');
  const [emailUser, setEmailUser] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [calendarProvider, setCalendarProvider] = useState('google');
  const [calendarApiKey, setCalendarApiKey] = useState('');
  const [apolloApiKey, setApolloApiKey] = useState('');

  useEffect(() => {
    if (window.electron) {
        window.electron.getSettings().then((settings) => {
            setLinkedinClientId(settings.LINKEDIN_CLIENT_ID || '');
            setLinkedinClientSecret(settings.LINKEDIN_CLIENT_SECRET || '');
            setAiProvider(settings.AI_PROVIDER || 'gemini');
            setLocalApiUrl(settings.LOCAL_API_URL || 'http://localhost:11434/v1');
            setEmailProvider(settings.EMAIL_PROVIDER || 'gmail');
            setEmailUser(settings.EMAIL_USER || '');
            setEmailPassword(settings.EMAIL_PASSWORD || '');
            setCalendarProvider(settings.CALENDAR_PROVIDER || 'google');
            setCalendarApiKey(settings.CALENDAR_API_KEY || '');
            setApolloApiKey(settings.APOLLO_API_KEY || '');
        });
    }
  }, []);

  const saveSettings = () => {
    if (window.electron) {
        window.electron.saveSettings({
            LINKEDIN_CLIENT_ID: linkedinClientId,
            LINKEDIN_CLIENT_SECRET: linkedinClientSecret,
            AI_PROVIDER: aiProvider,
            LOCAL_API_URL: localApiUrl,
            EMAIL_PROVIDER: emailProvider,
            EMAIL_USER: emailUser,
            EMAIL_PASSWORD: emailPassword,
            CALENDAR_PROVIDER: calendarProvider,
            CALENDAR_API_KEY: calendarApiKey,
            APOLLO_API_KEY: apolloApiKey
        });
    }
    alert('Settings saved to database!');
  };

  return (
    <div className="p-4 bg-slate-800 rounded shadow text-white">
      <h2 className="text-lg font-semibold mb-3">Settings</h2>
      <p className="text-xs text-yellow-400 mb-4 italic">
        Warning: For demo purposes only. Storing API keys in localStorage is insecure.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm">LinkedIn Client ID</label>
          <input
            type="text"
            value={linkedinClientId}
            onChange={(e) => setLinkedinClientId(e.target.value)}
            className="w-full text-black p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">LinkedIn Client Secret</label>
          <input
            type="password"
            value={linkedinClientSecret}
            onChange={(e) => setLinkedinClientSecret(e.target.value)}
            className="w-full text-black p-2 rounded"
          />
        </div>
        <div className="border-t border-slate-700 pt-4">
          <label className="block text-sm mb-2">AI Provider</label>
          <select
            value={aiProvider}
            onChange={(e) => setAiProvider(e.target.value)}
            className="w-full text-black p-2 rounded"
          >
            <option value="gemini">Gemini (Cloud)</option>
            <option value="local">Local Open Source Model</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Local API Base URL</label>
          <input
            type="text"
            value={localApiUrl}
            onChange={(e) => setLocalApiUrl(e.target.value)}
            className="w-full text-black p-2 rounded"
          />
        </div>
        <div className="border-t border-slate-700 pt-4">
          <h3 className="text-sm font-semibold mb-2">Email Integration</h3>
          <select value={emailProvider} onChange={(e) => setEmailProvider(e.target.value)} className="w-full text-black p-2 rounded mb-2">
            <option value="gmail">Gmail</option>
            <option value="outlook">Outlook</option>
            <option value="smtp">SMTP</option>
          </select>
          <input type="text" placeholder="Email/Username" value={emailUser} onChange={(e) => setEmailUser(e.target.value)} className="w-full text-black p-2 rounded mb-2" />
          <input type="password" placeholder="Password/App Key" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} className="w-full text-black p-2 rounded" />
        </div>
        <div className="border-t border-slate-700 pt-4">
          <h3 className="text-sm font-semibold mb-2">Calendar Integration</h3>
          <select value={calendarProvider} onChange={(e) => setCalendarProvider(e.target.value)} className="w-full text-black p-2 rounded mb-2">
            <option value="google">Google Calendar</option>
            <option value="outlook">Outlook Calendar</option>
          </select>
          <input type="password" placeholder="API Key/Credentials" value={calendarApiKey} onChange={(e) => setCalendarApiKey(e.target.value)} className="w-full text-black p-2 rounded" />
        </div>
        <div className="border-t border-slate-700 pt-4">
          <h3 className="text-sm font-semibold mb-2">Apollo.io Integration</h3>
          <input type="password" placeholder="Apollo API Key" value={apolloApiKey} onChange={(e) => setApolloApiKey(e.target.value)} className="w-full text-black p-2 rounded" />
        </div>
        <button
          onClick={saveSettings}
          className="bg-indigo-600 px-4 py-2 rounded text-sm hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};
