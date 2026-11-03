import React, { useState } from 'react';
import { Download, Share2, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-all shadow-sm"
        title="Install Voice of Kannada on your device for offline learning"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Add to Home Screen</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-white">Install on iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Enjoy offline access to Kannada lessons and voice practice on your iOS device:
              </p>
              <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <li>Tap the <strong className="text-emerald-400">Share</strong> button in Safari's bottom toolbar.</li>
                <li>Scroll down and tap <strong className="text-emerald-400">Add to Home Screen</strong>.</li>
                <li>Confirm by tapping <strong className="text-emerald-400">Add</strong>.</li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-medium text-white transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
