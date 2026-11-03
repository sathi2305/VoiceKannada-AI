import React, { useState } from 'react';
import {
  LayoutDashboard,
  Mic,
  GraduationCap,
  Sparkles,
  BookOpen,
  History,
  TrendingUp,
  Settings,
  Info,
  X,
  Layers,
  Headphones,
  Eye,
  Languages,
  Compass,
  Trophy,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { NavTab } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  streakDays: number;
  completedLessonsCount: number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItemDef {
  id: NavTab;
  label: string;
  labelKannada: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

interface NavGroupDef {
  groupTitle: string;
  groupTitleKannada: string;
  items: NavItemDef[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  streakDays,
  completedLessonsCount,
  collapsed = false,
  onToggleCollapse
}) => {
  const navGroups: NavGroupDef[] = [
    {
      groupTitle: 'Core Intelligence',
      groupTitleKannada: 'ಕೇಂದ್ರ ಅನುಭವ',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          labelKannada: 'ಮುಖಪುಟ',
          icon: <LayoutDashboard className="w-5 h-5" />
        },
        {
          id: 'assistant',
          label: 'AI Voice Assistant',
          labelKannada: 'ಧ್ವನಿ ಸಹಾಯಕ',
          icon: <Mic className="w-5 h-5 text-[#00E6A0]" />,
          badge: '3D AI',
          badgeColor: 'bg-[#00E6A0]/20 text-[#00E6A0] border-[#00E6A0]/30'
        },
        {
          id: 'practice',
          label: 'Speaking Practice',
          labelKannada: 'ಉಚ್ಚಾರಣೆ ಅಭ್ಯಾಸ',
          icon: <Sparkles className="w-5 h-5 text-[#00D9FF]" />,
          badge: 'Voice',
          badgeColor: 'bg-[#00D9FF]/20 text-[#00D9FF] border-[#00D9FF]/30'
        }
      ]
    },
    {
      groupTitle: 'Multimodal AI',
      groupTitleKannada: 'ಬಹುಮಾಧ್ಯಮ AI',
      items: [
        {
          id: 'vision',
          label: 'Visual Signboard OCR',
          labelKannada: 'ದೃಷ್ಟಿ ಜ್ಞಾನ',
          icon: <Eye className="w-5 h-5 text-emerald-400" />,
          badge: 'Vision',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        },
        {
          id: 'translator',
          label: 'Two-Way Translator',
          labelKannada: 'ದ್ವಿಭಾಷಾ ಸಂವಾದ',
          icon: <Languages className="w-5 h-5 text-teal-400" />,
          badge: 'Live',
          badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
        },
        {
          id: 'culture',
          label: 'Culture & Dialects',
          labelKannada: 'ಸಂಸ್ಕೃತಿ & ಉಪಭಾಷೆ',
          icon: <Compass className="w-5 h-5 text-cyan-400" />
        }
      ]
    },
    {
      groupTitle: 'Interactive Studios',
      groupTitleKannada: 'ಕಲಿಕಾ ಕೇಂದ್ರಗಳು',
      items: [
        {
          id: 'quests',
          label: 'Learning Quests',
          labelKannada: 'ಕಲಿಕಾ ಅಭಿಯಾನ',
          icon: <Trophy className="w-5 h-5 text-amber-400" />,
          badge: 'Quests',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        },
        {
          id: 'mistakes',
          label: 'Mistake Coach',
          labelKannada: 'ಉಚ್ಚಾರಣೆ ತಿದ್ದುಪಡಿ',
          icon: <ShieldAlert className="w-5 h-5 text-rose-400" />
        },
        {
          id: 'learning',
          label: 'Learning Studio',
          labelKannada: 'ಕಲಿಕಾ ಕೇಂದ್ರ',
          icon: <GraduationCap className="w-5 h-5 text-emerald-400" />
        },
        {
          id: 'characters',
          label: 'Script & Grammar Lab',
          labelKannada: 'ವರ್ಣಮಾಲೆ & ವ್ಯಾಕರಣ',
          icon: <BookOpen className="w-5 h-5 text-cyan-400" />
        },
        {
          id: 'builder',
          label: 'Sentence Builder',
          labelKannada: 'ಪದ ಜೋಡಣೆ',
          icon: <Layers className="w-5 h-5 text-teal-400" />
        },
        {
          id: 'listening',
          label: 'Listening Studio',
          labelKannada: 'ಆಲಿಸುವಿಕೆ',
          icon: <Headphones className="w-5 h-5 text-emerald-400" />
        },
        {
          id: 'roleplay',
          label: 'Role-Play Simulator',
          labelKannada: 'ಸನ್ನಿವೇಶ ಅಭಿನಯ',
          icon: <Sparkles className="w-5 h-5 text-violet-400" />
        },
        {
          id: 'vocabulary',
          label: 'Vocabulary & SRS',
          labelKannada: 'ಶಬ್ದಕೋಶ',
          icon: <BookOpen className="w-5 h-5 text-slate-300" />,
          badge: 'SRS',
          badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30'
        }
      ]
    },
    {
      groupTitle: 'Analytics & Settings',
      groupTitleKannada: 'ಪ್ರಗತಿ & ಸೆಟ್ಟಿಂಗ್ಸ್',
      items: [
        {
          id: 'progress',
          label: 'Progress & Analytics',
          labelKannada: 'ಪ್ರಗತಿ ವಿವರ',
          icon: <TrendingUp className="w-5 h-5 text-emerald-400" />
        },
        {
          id: 'history',
          label: 'Conversation History',
          labelKannada: 'ಸಂಭಾಷಣೆ ಇತಿಹಾಸ',
          icon: <History className="w-5 h-5 text-slate-400" />
        },
        {
          id: 'settings',
          label: 'Settings & Privacy',
          labelKannada: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
          icon: <Settings className="w-5 h-5 text-slate-400" />
        },
        {
          id: 'about',
          label: 'About & Challenge',
          labelKannada: 'ಯೋಜನಾ ಮಾಹಿತಿ',
          icon: <Info className="w-5 h-5 text-slate-400" />
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#04111F] border-r border-[#00D9FF]/15 flex flex-col transition-all duration-300 ease-in-out shadow-2xl ${
          collapsed ? 'lg:w-20' : 'lg:w-72'
        } ${
          mobileOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#00D9FF]/15 flex items-center justify-between min-h-[4rem] bg-[#071D32]/40">
          <div
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-3 cursor-pointer group ${
              collapsed ? 'lg:justify-center lg:w-full' : ''
            }`}
            title="Voice of Kannada (ಕನ್ನಡದ ಧ್ವನಿ)"
          >
            {/* Luminous Brand Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E6A0] via-[#00D9FF] to-[#8257FF] p-[1px] shadow-[0_0_15px_rgba(0,230,160,0.35)] shrink-0 transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-[11px] bg-[#04111F] flex items-center justify-center">
                <Mic className="w-5 h-5 text-[#00E6A0]" />
              </div>
            </div>

            {/* Brand Title (Hidden in collapsed rail mode) */}
            <div className={`overflow-hidden transition-all duration-200 ${collapsed ? 'lg:hidden' : 'block'}`}>
              <h1 className="text-sm font-bold tracking-tight text-[#F1F7FF] flex items-center gap-1.5 leading-tight">
                <span>Voice of Kannada</span>
              </h1>
              <p className="text-[11px] font-kannada text-[#00E6A0] font-medium leading-none mt-0.5">
                ಕನ್ನಡದ ಧ್ವನಿ
              </p>
            </div>
          </div>

          {/* Desktop Collapse / Expand Toggle Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={`hidden lg:flex p-1.5 rounded-lg text-[#9BB1C8] hover:text-[#00E6A0] hover:bg-[#071D32] border border-transparent hover:border-[#00D9FF]/20 transition-colors cursor-pointer ${
                collapsed ? 'hidden' : 'flex'
              }`}
              title="Collapse sidebar rail (ಸಂಕುಚಿತಗೊಳಿಸಿ)"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-white lg:hidden rounded-lg hover:bg-slate-800"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Streak Status Bar */}
        <div
          className={`border-b border-[#00D9FF]/10 bg-[#071D32]/30 text-xs text-[#9BB1C8] flex items-center transition-all ${
            collapsed ? 'lg:p-2 lg:justify-center' : 'px-4 py-2.5 justify-between'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00E6A0] animate-pulse shrink-0" />
            <span className={collapsed ? 'lg:hidden' : 'inline'}>Kannada AI Core</span>
          </div>
          <div
            className="flex items-center gap-1 text-[#00E6A0] font-mono font-bold"
            title={`${streakDays} Day Active Streak`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{streakDays}d</span>
          </div>
        </div>

        {/* Navigation Item Groups */}
        <nav className="flex-1 overflow-y-auto p-2.5 space-y-4 custom-scrollbar">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {/* Group Title (hidden when collapsed) */}
              <div className={`px-2.5 pt-1.5 pb-1 ${collapsed ? 'lg:hidden' : 'block'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9BB1C8]/80">
                    {group.groupTitle}
                  </span>
                  <span className="text-[10px] font-kannada text-[#00D9FF]/80">
                    {group.groupTitleKannada}
                  </span>
                </div>
              </div>

              {/* Collapsed Group Divider Line */}
              {collapsed && gIdx > 0 && (
                <div className="hidden lg:block my-2 mx-auto w-8 border-t border-[#00D9FF]/15" />
              )}

              {/* Items in Group */}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = currentTab === item.id;
                  return (
                    <div key={item.id} className="relative group">
                      <button
                        onClick={() => {
                          onSelectTab(item.id);
                          onCloseMobile();
                        }}
                        className={`w-full flex items-center rounded-xl transition-all duration-200 text-left relative cursor-pointer ${
                          collapsed
                            ? 'lg:justify-center lg:p-2.5'
                            : 'gap-3 px-3 py-2 text-xs'
                        } ${
                          active
                            ? 'bg-[#071D32] text-[#F1F7FF] border border-[#00E6A0]/40 shadow-[0_0_20px_rgba(0,230,160,0.15)] font-semibold'
                            : 'text-[#9BB1C8] hover:text-[#F1F7FF] hover:bg-[#071D32]/50 border border-transparent'
                        }`}
                      >
                        {/* Active Left Illuminated Indicator Bar */}
                        {active && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-[#00E6A0] to-[#00D9FF] shadow-[0_0_10px_rgba(0,230,160,0.8)]" />
                        )}

                        {/* Item Icon */}
                        <span
                          className={`shrink-0 transition-transform group-hover:scale-110 ${
                            active ? 'text-[#00E6A0]' : 'text-[#9BB1C8] group-hover:text-[#F1F7FF]'
                          }`}
                        >
                          {item.icon}
                        </span>

                        {/* Labels & Badge (Hidden in collapsed rail mode) */}
                        <div className={`flex-1 min-w-0 ${collapsed ? 'lg:hidden' : 'block'}`}>
                          <div className="flex items-center justify-between gap-1">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider shrink-0 ${
                                  item.badgeColor || 'bg-[#00E6A0]/20 text-[#00E6A0] border-[#00E6A0]/30'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-kannada text-slate-400 block -mt-0.5 truncate">
                            {item.labelKannada}
                          </span>
                        </div>
                      </button>

                      {/* Tooltip on Hover in Collapsed Rail Mode */}
                      {collapsed && (
                        <div className="hidden lg:group-hover:flex absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none items-center">
                          {/* Triangle caret */}
                          <div className="w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-[#00D9FF]/40 -mr-0.5" />
                          <div className="px-3 py-2 rounded-xl bg-[#04111F] border border-[#00D9FF]/30 shadow-2xl backdrop-blur-xl text-left whitespace-nowrap space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#F1F7FF]">{item.label}</span>
                              {item.badge && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${
                                    item.badgeColor || 'bg-[#00E6A0]/20 text-[#00E6A0] border-[#00E6A0]/30'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-kannada text-[#00E6A0]">{item.labelKannada}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapsed Rail Expand Button */}
        {collapsed && onToggleCollapse && (
          <div className="hidden lg:flex p-3 border-t border-[#00D9FF]/10 justify-center">
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-xl text-[#9BB1C8] hover:text-[#00E6A0] hover:bg-[#071D32] border border-[#00D9FF]/15 transition-all cursor-pointer"
              title="Expand sidebar navigation (ವಿಸ್ತರಿಸಿ)"
              aria-label="Expand sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* PWA Install Button (Adapted for expanded / collapsed) */}
        <div className={`px-3 pb-1 ${collapsed ? 'lg:px-2' : ''}`}>
          <PWAInstallButton />
        </div>

        {/* Learning Quick Progress Card (Expanded mode only) */}
        {!collapsed && (
          <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-br from-[#071D32] to-[#04111F] border border-[#00D9FF]/20 shadow-md">
            <div className="flex items-center justify-between text-xs text-[#9BB1C8] mb-1.5">
              <span className="font-medium">Course Progress</span>
              <span className="text-[#00E6A0] font-mono font-bold">
                {completedLessonsCount}/6 Modules
              </span>
            </div>
            <div className="w-full bg-[#04111F] h-1.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-[#00E6A0] via-[#00D9FF] to-[#8257FF] h-full transition-all duration-500 shadow-[0_0_10px_rgba(0,230,160,0.5)]"
                style={{ width: `${Math.round((completedLessonsCount / 6) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">
              Practice speaking daily to unlock fluent Kannada conversation.
            </p>
          </div>
        )}

        {/* Footer info (Expanded mode) */}
        {!collapsed && (
          <div className="p-3 border-t border-[#00D9FF]/15 text-[10px] text-[#9BB1C8] flex items-center justify-between bg-[#071D32]/30">
            <span>Kannada AI Universe</span>
            <span className="font-mono text-[#00E6A0] font-bold">kn-IN</span>
          </div>
        )}
      </aside>
    </>
  );
};
