import { useState, FormEvent, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { identifyICP } from '../services/aiService';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export function ChatOnboarding({ onComplete }: { onComplete: (data: { product: string; usp: string; negativeAttributes: string }) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hi! I am your AI SDR onboarding assistant. To get started, tell me about your product or service.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0: product, 1: usp, 2: negative, 3: done
  const [data, setData] = useState({ product: '', usp: '', negativeAttributes: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input } as Message];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    let nextData = { ...data };
    let nextStep = step;
    let aiResponse = '';

    if (step === 0) {
      nextData.product = input;
      aiResponse = 'Great. Now, what is the unique value proposition (USP) of your product?';
      nextStep = 1;
    } else if (step === 1) {
      nextData.usp = input;
      aiResponse = 'Finally, what are some exclusionary criteria (negative attributes) for your ideal customers?';
      nextStep = 2;
    } else if (step === 2) {
      nextData.negativeAttributes = input;
      aiResponse = 'Perfect! Analyzing everything now and setting up your workspace...';
      nextStep = 3;
    }

    setData(nextData);
    setStep(nextStep);
    setMessages([...newMessages, { role: 'ai', content: aiResponse }]);
    setLoading(false);

    if (nextStep === 3) {
        setTimeout(() => onComplete(nextData), 1000);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 bg-[#0D0D0F] rounded-2xl border border-white/5">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-lg ${m.role === 'ai' ? 'bg-white/5 self-start text-indigo-300' : 'bg-indigo-600 self-end text-white'}`}>
            {m.content}
          </div>
        ))}
        {loading && <Loader2 className="animate-spin text-white" />}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" 
          placeholder="Type your answer..."
        />
        <button type="submit" className="bg-indigo-600 p-2.5 rounded-lg text-white hover:bg-indigo-700">
          <Send />
        </button>
      </form>
    </div>
  );
}
