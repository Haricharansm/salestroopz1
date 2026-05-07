import { useState, useEffect, FormEvent } from 'react';
import { generateSdrContent, generateCadence, identifyICP, filterProspects, analyzeReply } from './services/aiService';
import { Loader2, Copy, Send, Calendar, Plus, Trash2, Edit, MessageSquare, Settings as SettingsIcon } from 'lucide-react';
import { Campaign, EmailStep, Prospect } from './types';
import { Settings } from './components/Settings';
import { CampaignAnalytics } from './components/CampaignAnalytics';

export default function App() {
  const [prospectName, setProspectName] = useState('');
  const [prospectCompany, setProspectCompany] = useState('');
  const [goal, setGoal] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Onboarding states
  const [onboarding, setOnboarding] = useState(true);
  const [product, setProduct] = useState('');
  const [usp, setUsp] = useState('');
  const [icp, setIcp] = useState('');

  // Reply simulation state
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const saved = localStorage.getItem('sdr_prospects');
    if (saved) setProspects(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('sdr_prospects', JSON.stringify(prospects));
  }, [prospects]);

  const handleReplySubmit = async (prospectId: string) => {
      const content = replyInput[prospectId];
      if (!content) return;
      
      setLoading(true);
      const analysis = await analyzeReply(content);
      const newReply = { 
          id: Date.now().toString(), 
          content,
          ...analysis,
          timestamp: new Date().toISOString()
      };
      
      setProspects(prospects.map(p => p.id === prospectId ? 
        { ...p, replies: [...(p.replies || []), newReply], status: analysis.category === 'interested' ? 'interested' : analysis.category === 'not interested' ? 'not interested' : analysis.category === 'objection' ? 'objection' : 'contacted' } 
      : p));
      
      setReplyInput({...replyInput, [prospectId]: ''});
      setLoading(false);
  };

  const handleOnboarding = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const identifiedIcp = await identifyICP(product, usp);
    setIcp(identifiedIcp);
    const matched = await filterProspects(identifiedIcp, prospects);
    setProspects(matched);
    setLoading(false);
    setOnboarding(false);
  };

  const handleGenerate = async () => {
    if (!prospectName || !prospectCompany || !goal) return;
    setLoading(true);
    try {
      const email = await generateSdrContent(prospectName, prospectCompany, goal);
      setGeneratedEmail(email);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProspect = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const target = e.target as typeof e.target & {
      name: { value: string };
      company: { value: string };
      email: { value: string };
      phone: { value: string };
      notes: { value: string };
    };

    const email = target.email.value;
    const phone = target.phone.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (email && !emailRegex.test(email)) {
      setError('Invalid email address format.');
      return;
    }
    if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
      setError('Invalid phone number format.');
      return;
    }

    const newProspect: Prospect = {
      id: editingProspect?.id || Date.now().toString(),
      name: target.name.value,
      company: target.company.value,
      email: email,
      phone: phone,
      notes: target.notes.value,
      status: editingProspect?.status || 'new'
    };
    if (editingProspect) {
        setProspects(prospects.map(p => p.id === newProspect.id ? newProspect : p));
        setEditingProspect(null);
    } else {
        setProspects([...prospects, newProspect]);
    }
    (e.target as HTMLFormElement).reset();
  };

  const handleGenerateCadence = async () => {
      setLoading(true);
      try {
          const steps = await generateCadence(prospectName, prospectCompany, goal, 3);
          const newCampaign: Campaign = {
              id: Date.now().toString(),
              prospectId: '1',
              name: `${prospectName} Cadence`,
              steps: steps,
              currentStepIndex: 0,
              startDate: new Date().toISOString().split('T')[0]
          };
          setCampaigns([...campaigns, newCampaign]);
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
  }

  if (onboarding) {
      return (
          <div className="min-h-screen bg-[#050506] p-6 flex flex-col items-center text-white">
              <h1 className="text-3xl font-bold mb-8">Onboarding: Define Offer</h1>
              <form onSubmit={handleOnboarding} className="max-w-xl w-full bg-[#0D0D0F] p-6 rounded-2xl border border-white/5 space-y-4">
                  <textarea name="product" placeholder="Product/Service Description" onChange={e => setProduct(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" rows={3} required />
                  <textarea name="usp" placeholder="Unique Value Proposition (USP)" onChange={e => setUsp(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" rows={3} required />
                  <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 p-2.5 rounded-lg">{loading ? 'Analyzing...' : 'Identify ICP & Filter Contacts'}</button>
              </form>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#050506] p-6 flex flex-col items-center text-[#E0E0E6]">
      <header className="max-w-4xl w-full mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AI SDR Assistant</h1>
          <p className="text-slate-400 mt-2">Craft personalized outreach emails and manage cadences.</p>
        </div>
        <button onClick={() => setShowSettings(!showSettings)} className="text-slate-400 hover:text-white">
          <SettingsIcon />
        </button>
      </header>
      
      {showSettings && <div className="max-w-4xl w-full mb-8"><Settings /></div>}
      
      <main className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="bg-[#0D0D0F] p-6 rounded-2xl shadow-xl border border-white/5 space-y-4">
            <h2 className="text-xl font-semibold text-white">Contacts</h2>
            {error && <p className="text-red-500 text-sm bg-red-900/20 p-2 rounded">{error}</p>}
            <form onSubmit={handleSaveProspect} className="space-y-2">
                <input name="name" placeholder="Name" defaultValue={editingProspect?.name} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" required />
                <input name="company" placeholder="Company" defaultValue={editingProspect?.company} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" />
                <input name="email" placeholder="Email" defaultValue={editingProspect?.email} type="email" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" />
                <input name="phone" placeholder="Phone" defaultValue={editingProspect?.phone} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" />
                <textarea name="notes" placeholder="Notes" defaultValue={editingProspect?.notes} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" rows={3} />
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-2.5">{editingProspect ? 'Update' : 'Add'} Prospect</button>
            </form>
            <div className="space-y-4">
                {prospects.map(p => (
                    <div key={p.id} className="bg-[#08080A] p-4 rounded-xl space-y-4 border border-white/5">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-semibold text-white">{p.name}</div>
                                <div className="text-xs text-slate-400">{p.company} • {p.status}</div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setEditingProspect(p)} className="text-slate-400 hover:text-white"><Edit size={16}/></button>
                                <button onClick={() => setProspects(prospects.filter(pr => pr.id !== p.id))} className="text-red-500 hover:text-red-400"><Trash2 size={16}/></button>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            {p.replies?.map(r => (
                                <div key={r.id} className="bg-white/5 p-3 rounded text-xs text-slate-300 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-indigo-400 font-semibold">{r.category} ({r.sentiment}, Score: {r.intentScore})</span>
                                        <span className="text-slate-500">{new Date(r.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-slate-100 italic border-l-2 border-slate-700 pl-2">"{r.content}"</p>
                                    <div className="mt-2 space-y-0.5">
                                      <p><span className="font-semibold text-slate-400">Quick:</span> {r.suggestedAction}</p>
                                      <p><span className="font-semibold text-indigo-300">Nuanced:</span> {r.nuancedAction}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input 
                                value={replyInput[p.id] || ''}
                                onChange={e => setReplyInput({...replyInput, [p.id]: e.target.value})}
                                placeholder="Simulate reply..."
                                className="flex-1 bg-white/5 border border-white/10 rounded p-2 text-white text-xs"
                            />
                            <button onClick={() => handleReplySubmit(p.id)} className="bg-indigo-600 p-2 rounded"><MessageSquare size={16}/></button>
                        </div>
                        
                        {p.status === 'interested' && !p.meeting && (
                            <button
                                onClick={() => {
                                    const date = prompt("Enter booking date (YYYY-MM-DD):");
                                    const time = prompt("Enter booking time (HH:MM):");
                                    if (date && time) {
                                        setProspects(prospects.map(pr => pr.id === p.id ? {...pr, status: 'meeting_booked', meeting: { date, time }}: pr));
                                    }
                                }}
                                className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs flex items-center justify-center gap-1"
                            >
                                <Calendar size={14}/> Book Meeting
                            </button>
                        )}
                        {p.meeting && (
                            <div className="text-xs text-green-400 bg-green-900/20 p-2 rounded w-full text-center">
                                Meeting booked: {p.meeting.date} at {p.meeting.time}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
        
        <section className="bg-[#0D0D0F] p-6 rounded-2xl shadow-xl border border-white/5 space-y-4">
            <h2 className="text-xl font-semibold text-white">Create Outreach</h2>
            <select
                onChange={(e) => {
                    const p = prospects.find(pr => pr.id === e.target.value);
                    if(p) { setProspectName(p.name); setProspectCompany(p.company || ''); }
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white"
            >
                <option value="">Select Prospect</option>
                {prospects.map(p => <option key={p.id} value={p.id}>{p.name} ({p.company})</option>)}
            </select>
          <div>
            <label className="block text-sm font-medium text-slate-300">Prospect Name</label>
            <input 
              value={prospectName} 
              onChange={(e) => setProspectName(e.target.value)}
              className="mt-1 block w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Prospect Company</label>
            <input 
              value={prospectCompany} 
              onChange={(e) => setProspectCompany(e.target.value)}
              className="mt-1 block w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Goal / Context</label>
            <textarea 
              value={goal} 
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1 block w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
              rows={3}
              placeholder="e.g. Introduce our new AI platform"
            />
          </div>
          <div className="flex gap-2">
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:bg-indigo-800 transition-colors"
            >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" />}
                Generate Email
            </button>
            <button 
                onClick={handleGenerateCadence}
                disabled={loading}
                className="flex-1 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 px-4 rounded-lg disabled:bg-slate-900 transition-colors"
            >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />}
                Create Cadence
            </button>
          </div>
        </section>

        <section className="space-y-6">
        {generatedEmail && (
          <div className="p-6 bg-[#08080A] rounded-xl border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-2">Generated Email:</h2>
            <pre className="whitespace-pre-wrap font-sans text-slate-300 text-sm">{generatedEmail}</pre>
            <button 
                onClick={() => navigator.clipboard.writeText(generatedEmail)}
                className="mt-4 flex items-center text-sm text-indigo-400 hover:text-indigo-300"
            >
              <Copy className="mr-1 h-4 w-4" /> Copy to clipboard
            </button>
          </div>
        )}
        
        {campaigns.length > 0 && (
            <div className="p-6 bg-[#0D0D0F] rounded-2xl border border-white/5 shadow-xl">
                <h2 className="text-lg font-semibold text-white mb-4">Active Cadences</h2>
                {campaigns.map(c => (
                    <div key={c.id} className="bg-[#08080A] rounded-xl p-4 border border-white/5 mb-4">
                        <div className="font-semibold text-white mb-2">{c.name}</div>
                        <div className="text-xs text-slate-400 mb-2 flex items-center gap-2">
                             Start Date: 
                             <input 
                                type="date"
                                value={c.startDate}
                                onChange={(e) => {
                                    const newCampaigns = campaigns.map(camp => camp.id === c.id ? { ...camp, startDate: e.target.value } : camp);
                                    setCampaigns(newCampaigns);
                                }}
                                className="bg-white/5 text-white p-1 rounded"
                             />
                        </div>
                        <div className="space-y-2">
                             {c.steps.map((step, i) => (
                                 <div key={step.id} className="p-3 rounded border bg-white/5 border-transparent space-y-2">
                                     <div className="flex justify-between items-center">
                                       <div className="font-semibold text-sm">Step {i + 1}</div>
                                       <input 
                                         type="date" 
                                         value={step.sendDate} 
                                         onChange={(e) => {
                                             const newCampaigns = campaigns.map(camp => camp.id === c.id ? { ...camp, steps: camp.steps.map(s => s.id === step.id ? { ...s, sendDate: e.target.value } : s) } : camp);
                                             setCampaigns(newCampaigns);
                                         }}
                                         className="bg-white/5 text-xs text-white p-1 rounded"
                                       />
                                     </div>
                                     <div className="space-y-1">
                                       {step.variants.map(v => (
                                          <input
                                            key={v.id}
                                            value={v.subject}
                                            onChange={(e) => {
                                                const newSubject = e.target.value;
                                                const newCampaigns = campaigns.map(camp => camp.id === c.id ? { ...camp, steps: camp.steps.map(s => s.id === step.id ? { ...s, variants: s.variants.map(varnt => varnt.id === v.id ? {...varnt, subject: newSubject} : varnt) } : s) } : camp);
                                                setCampaigns(newCampaigns);
                                            }}
                                            className={`w-full bg-white/5 text-xs text-white p-1 rounded border ${v.id === step.selectedVariantId ? 'border-indigo-500' : 'border-transparent'}`}
                                          />
                                       ))}
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                ))}
            </div>
        )}
        <CampaignAnalytics />
        </section>
      </main>
    </div>
  );
}
