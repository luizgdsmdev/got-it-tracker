import React from 'react';
import { motion } from 'motion/react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarNavProps {
  menuItems: MenuItem[];
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onClose: () => void;
}

export default function SidebarNav({
  menuItems,
  currentScreen,
  onNavigate,
  onClose,
}: SidebarNavProps) {
  return (
    <nav className="space-y-1">
      {menuItems.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all relative overflow-hidden group cursor-pointer ${
              isActive
                ? 'bg-indigo-50/70 text-[#1a146b] dark:bg-indigo-950/20 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/80'
            }`}
          >
            {/* Active Indicator Line */}
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-0 bottom-0 w-1 bg-[#1a146b] dark:bg-indigo-400 rounded-r-lg"
              />
            )}
            <span className={`transition-transform duration-300 group-hover:scale-105 ${isActive ? 'text-[#1a146b] dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
