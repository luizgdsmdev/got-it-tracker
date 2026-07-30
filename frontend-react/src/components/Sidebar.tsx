import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  ShieldCheck,
  FolderLock,
  LogOut,
  X,
  Tent
} from 'lucide-react';
import { Person } from '../types';
import { translations } from '../translations';

// Subcomponents
import SidebarUserCard from './sidebar/SidebarUserCard';
import SidebarNav from './sidebar/SidebarNav';

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  isOpen: boolean;
  onClose: () => void;
  currentUser: Person;
  onLogout: () => void;
  onEditProfile?: () => void;
  lang: 'pt' | 'en';
}

export default function Sidebar({
  currentScreen,
  onNavigate,
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onEditProfile,
  lang,
}: SidebarProps) {
  const t = translations[lang] || translations.pt || translations.en;

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'playgrounds', label: t.playgrounds, icon: <Tent className="w-5 h-5" /> },
    { id: 'approvals', label: t.approvals, icon: <ShieldCheck className="w-5 h-5" /> },
    // { id: 'admin', label: t.globalSettings, icon: <FolderLock className="w-5 h-5" /> },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-6 w-72 select-none relative z-50">
      <div className="space-y-8">
        {/* Close button container */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card Subcomponent */}
        <SidebarUserCard currentUser={currentUser} onEditProfile={onEditProfile} />

        {/* Navigation Menu Items Subcomponent */}
        <SidebarNav
          menuItems={menuItems}
          currentScreen={currentScreen}
          onNavigate={onNavigate}
          onClose={onClose}
        />
      </div>

      {/* Footer Section */}
      <div className="space-y-4">
        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 cursor-pointer transition-colors"
          type="button"
        >
          <LogOut className="w-5 h-5 text-rose-400" />
          <span>{t.logout}</span>
        </button>

        {/* Brand version */}
        <p className="text-[9px] text-slate-400 text-center uppercase tracking-widest font-semibold">
          v1.4.0 • Enterprise
        </p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Overlay (Click outside) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 cursor-pointer"
          />

          {/* Sidebar Slide-in Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative z-50 h-full shadow-2xl"
          >
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
