import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { UserPlus, Trash2, Mail, User, Shield, Info, Edit3 } from 'lucide-react';
import { Person } from '../../types';
import AddPlaygroundMemberModal from './AddPlaygroundMemberModal';
import EditMemberModal from './EditMemberModal';
import { getRoleName } from '../../services/playgroundMemberService';

interface PlaygroundMembersTabProps {
  playgroundId: string;
  playgroundMembers: Person[];
  isAddMemberOpen: boolean;
  setIsAddMemberOpen: (open: boolean) => void;
  handleRemoveMember: (personId: string) => void;
  onAddUserInvite: (email: string, roleNum: number) => void;
  onAddGuest: (name: string, age: number) => void;
  onMemberUpdated?: () => void;
  addToast: (toast: any) => void;
  t: any;
  lang: 'pt' | 'en';
}

export default function PlaygroundMembersTab({
  playgroundId,
  playgroundMembers,
  isAddMemberOpen,
  setIsAddMemberOpen,
  handleRemoveMember,
  onAddUserInvite,
  onAddGuest,
  onMemberUpdated,
  addToast,
  t,
  lang,
}: PlaygroundMembersTabProps) {
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState<{ id: string; name: string } | null>(null);

  return (
    <div className="space-y-6">
      {/* Header and Add Member Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-[#1a146b] dark:text-slate-100">
            {lang === 'pt' ? 'Membros do Playground' : 'Playground Members'}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {lang === 'pt'
              ? 'Gerencie os integrantes que possuem acesso a este playground.'
              : 'Manage who belongs to this budget space.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddMemberOpen(true)}
          className="bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white h-11 px-5 rounded-xl flex items-center gap-2 font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.addPlaygroundMember || (lang === 'pt' ? 'Adicionar Integrante' : 'Add Member')}</span>
        </button>
      </div>

      {/* Members List */}
      <div className="grid grid-cols-1 gap-3">
        {playgroundMembers.map((mem) => (
          <div
            key={mem.id}
            onClick={() => setSelectedMemberForEdit({ id: mem.id, name: mem.name })}
            className="bg-white dark:bg-slate-900 p-4 rounded-3xl flex items-center justify-between border border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              {mem.avatarUrl ? (
                <img
                  src={mem.avatarUrl}
                  alt={mem.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-slate-50"
                />
              ) : (
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                    mem.colorTheme || 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {mem.initials}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>{mem.name}</span>
                    <Edit3 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  {mem.email && (
                    <span className="text-[9px] bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Mail className="w-2.5 h-2.5" />
                      {mem.email}
                    </span>
                  )}
                  {!mem.email && (
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <User className="w-2.5 h-2.5" />
                      {lang === 'pt' ? 'Convidado' : 'Guest'}
                    </span>
                  )}
                </div>
                <p className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 mt-0.5">
                  {mem.role} • {mem.age} {t.yearsOld}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Edit Role / Admin button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMemberForEdit({ id: mem.id, name: mem.name });
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-xl transition-colors cursor-pointer"
                title={lang === 'pt' ? 'Editar Função / Permissões' : 'Edit Role & Permissions'}
              >
                <Edit3 className="w-4 h-4" />
              </button>

              {/* Remove Member button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveMember(mem.id);
                }}
                className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                title={t.removePlaygroundMember}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {playgroundMembers.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-400">
            {lang === 'pt' ? 'Este playground não possui membros adicionados.' : 'This playground has no active members.'}
          </div>
        )}
      </div>

      {/* Add Member Modal (Supports User Invite or Guest) */}
      <AnimatePresence>
        {isAddMemberOpen && (
          <AddPlaygroundMemberModal
            isOpen={isAddMemberOpen}
            onClose={() => setIsAddMemberOpen(false)}
            onAddUserInvite={onAddUserInvite}
            onAddGuest={onAddGuest}
            lang={lang}
          />
        )}
      </AnimatePresence>

      {/* Edit Member Modal */}
      {selectedMemberForEdit && (
        <EditMemberModal
          isOpen={!!selectedMemberForEdit}
          onClose={() => setSelectedMemberForEdit(null)}
          playgroundId={playgroundId}
          personId={selectedMemberForEdit.id}
          personName={selectedMemberForEdit.name}
          lang={lang}
          onMemberUpdated={() => {
            if (onMemberUpdated) onMemberUpdated();
          }}
          addToast={addToast}
        />
      )}
    </div>
  );
}

