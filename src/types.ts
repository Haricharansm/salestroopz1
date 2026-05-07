export interface ABVariant {
  id: string;
  subject: string;
  body: string;
}

export interface Reply {
  id: string;
  content: string;
  category: 'interested' | 'not interested' | 'objection' | 'neutral';
  sentiment: 'positive' | 'negative' | 'neutral';
  intentScore: number;
  suggestedAction: string;
  nuancedAction: string;
  timestamp: string;
}

export interface Prospect {
  id: string;
  name: string;
  company: string;
  email?: string;
  phone?: string;
  notes?: string;
  replies?: Reply[];
  status: 'new' | 'contacted' | 'interested' | 'not interested' | 'objection' | 'meeting_booked';
  meeting?: { date: string; time: string; };
}

export interface EmailStep {
  id: string;
  variants: ABVariant[];
  selectedVariantId: string;
  sendDate: string;
  status: 'pending' | 'sent';
}

export interface Campaign {
  id: string;
  prospectId: string;
  name: string;
  steps: EmailStep[];
  currentStepIndex: number;
  startDate: string;
}

declare global {
  interface Window {
    electron: {
        saveSettings: (settings: any) => Promise<void>;
        getSettings: () => Promise<any>;
        saveCampaigns: (campaigns: any) => Promise<void>;
        getCampaigns: () => Promise<any>;
        openAuthWindow: (url: string) => Promise<string>;
    };
  }
}
