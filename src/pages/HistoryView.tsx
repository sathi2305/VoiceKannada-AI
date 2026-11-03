import React, { useState } from 'react';
import {
  History,
  MessageSquare,
  Volume2,
  Trash2,
  Download,
  Calendar,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Conversation, NavTab } from '../types';

interface HistoryViewProps {
  conversations: Conversation[];
  onSpeak: (text: string) => void;
  onDeleteConversation: (id: string) => void;
  onNavigate: (tab: NavTab) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  conversations,
  onSpeak,
  onDeleteConversation,
  onNavigate
}) => {
  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(
    conversations.length > 0 ? conversations[0].id : null
  );

  const activeConvo = conversations.find(c => c.id === selectedConvoId) || conversations[0];

  const handleExportJson = (convo: Conversation) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(convo, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kannada-chat-${convo.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {conversations.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <History className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-semibold text-white">No Saved Conversations Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            When you converse with the Voice Assistant, click the bookmark icon on the toolbar to save your interaction history.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('assistant')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-medium text-xs rounded-xl transition-colors cursor-pointer"
            >
              Start AI Voice Conversation
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversation List Sidebar */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Saved Sessions ({conversations.length})</span>
            </div>

            <div className="space-y-2">
              {conversations.map(convo => {
                const isSelected = (activeConvo && activeConvo.id === convo.id);

                return (
                  <div
                    key={convo.id}
                    onClick={() => setSelectedConvoId(convo.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500/50 shadow-sm'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Calendar className="w-3 h-3" />
                        {new Date(convo.timestamp).toLocaleDateString()}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-medium">
                        {convo.messages.length} msgs
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold font-kannada text-white truncate">
                      {convo.title}
                    </h4>

                    <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-800/60">
                      <span className="text-[11px] text-slate-400">
                        {new Date(convo.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Conversation Detail View */}
          <div className="md:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between">
            {activeConvo ? (
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold font-kannada text-white">
                      {activeConvo.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Recorded on {new Date(activeConvo.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportJson(activeConvo)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Export as JSON"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteConversation(activeConvo.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages List */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {activeConvo.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border ${
                        m.role === 'user'
                          ? 'bg-slate-950/80 border-slate-800 text-right ml-8'
                          : 'bg-slate-900/90 border-slate-800/80 mr-8'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>{m.role === 'user' ? 'Learner (ನೀವು)' : 'AI Voice of Kannada'}</span>
                        <button
                          onClick={() => onSpeak(m.kannada)}
                          className="hover:text-emerald-400 transition-colors"
                          title="Play audio"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        </button>
                      </div>

                      <p className="text-base font-kannada font-medium text-white">
                        {m.kannada}
                      </p>

                      {m.transliteration && (
                        <p className="text-xs text-emerald-400/80 font-mono mt-0.5">
                          {m.transliteration}
                        </p>
                      )}

                      {m.english && (
                        <p className="text-xs text-slate-300 mt-1 pt-1 border-t border-slate-800/60">
                          {m.english}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
