import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, ShieldCheck, Check, Loader2, Calendar, Hash, User } from 'lucide-react';
import {
  getMemberApi,
  updateMemberApi,
  PlaygroundRole,
  PlaygroundMemberApiItem,
  getRoleName,
} from '../../services/playgroundMemberService';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  playgroundId: string;
  personId: string;
  personName: string;
  lang: 'pt' | 'en';
  onMemberUpdated: () => void;
  addToast: (toast: any) => void;
}

export default function EditMemberModal({
  isOpen,
  onClose,
  playgroundId,
  personId,
  personName,
  lang,
  onMemberUpdated,
  addToast,
}: EditMemberModalProps) {
  const [role, setRole] = useState<number>(PlaygroundRole.Contributor);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [joinedAt, setJoinedAt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !playgroundId || !personId) return;

    let isMounted = true;
    setIsLoading(true);
    setError('');

    getMemberApi(playgroundId, personId)
      .then((res: PlaygroundMemberApiItem) => {
        if (!isMounted) return;
        setRole(res.role || PlaygroundRole.Viewer);
        setIsAdmin(!!res.isAdmin);
        setJoinedAt(res.joinedAt || '');
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('getMemberApi failed, using fallback:', err);
        // Fallback default
        setRole(PlaygroundRole.Viewer);
        setIsAdmin(false);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, playgroundId, personId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      await updateMemberApi(playgroundId, personId, {
        role: Number(role),
        isAdmin,
      });

      addToast({
        type: 'success',
        title: lang === 'pt' ? 'Membro Atualizado' : 'Member Updated',
        message: lang === 'pt' ? 'Função e permissões alteradas na API com sucesso.' : 'Role and permissions updated successfully.',
      });

      onMemberUpdated();
      onClose();
    } catch (err: any) {
      console.error('updateMemberApi error:', err);
      setError(err.message || (lang === 'pt' ? 'Falha ao atualizar membro.' : 'Failed to update member.'));
      addToast({
        type: 'error',
        title: err.errorType || (lang === 'pt' ? 'Erro ao Atualizar' : 'Update Error'),
        message: err.message || (lang === 'pt' ? 'Falha ao atualizar o membro.' : 'Failed to update member.'),
        statusCode: err.statusCode,
        traceId: err.traceId,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10 max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-[#1a146b] dark:text-slate-100">
                {lang === 'pt' ? 'Gerenciar Membro do Playground' : 'Manage Playground Member'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">{personName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="text-xs">{lang === 'pt' ? 'Buscando informações...' : 'Fetching member details...'}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              {/* API Info Cards */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate" title={personId}>ID: {personId.substring(0, 8)}...</span>
                </div>
                {joinedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{new Date(joinedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Role selector */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pl-1">
                  {lang === 'pt' ? 'FUNÇÃO (ROLE)' : 'ROLE'}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(Number(e.target.value))}
                  className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={PlaygroundRole.Viewer}>1 - Viewer (Visualizador)</option>
                  <option value={PlaygroundRole.Contributor}>2 - Contributor (Colaborador)</option>
                  <option value={PlaygroundRole.Manager}>3 - Manager (Gestor)</option>
                  <option value={PlaygroundRole.Owner}>4 - Owner (Proprietário)</option>
                </select>
              </div>

              {/* Is Admin Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer" onClick={() => setIsAdmin(!isAdmin)}>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className={`w-5 h-5 ${isAdmin ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {lang === 'pt' ? 'Administrador do Playground' : 'Playground Admin'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {lang === 'pt' ? 'Concede privilégios administrativos' : 'Grants administrative privileges'}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {lang === 'pt' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[#1a146b] hover:bg-[#312e81] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === 'pt' ? 'Salvando...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{lang === 'pt' ? 'Salvar Alterações' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
