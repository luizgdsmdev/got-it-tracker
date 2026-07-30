import React from 'react';
import { Edit2 } from 'lucide-react';
import { Person } from '../../types';

interface SidebarUserCardProps {
  currentUser: Person;
  onEditProfile?: () => void;
}

export default function SidebarUserCard({ currentUser, onEditProfile }: SidebarUserCardProps) {
  return (
    <div
      onClick={onEditProfile}
      className={`p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex items-center gap-3 border border-slate-100/50 dark:border-slate-800/50 ${
        onEditProfile ? 'hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group' : ''
      }`}
      title={onEditProfile ? 'Editar meu perfil' : undefined}
    >
      {currentUser.avatarUrl ? (
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.name}
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full object-cover border border-indigo-100 dark:border-slate-700"
        />
      ) : (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${currentUser.colorTheme || 'bg-indigo-100 text-indigo-700'}`}>
          {currentUser.initials}
        </div>
      )}
      <div className="overflow-hidden flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
          {currentUser.name}
        </p>
        <p className="text-[10px] text-slate-400 font-medium capitalize truncate">
          {currentUser.role}
        </p>
      </div>
      {onEditProfile && (
        <Edit2 className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      )}
    </div>
  );
}
