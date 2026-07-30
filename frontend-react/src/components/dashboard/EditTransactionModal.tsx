import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Trash2, Loader2, DollarSign, Calendar, FileText, AlertCircle } from 'lucide-react';
import { Transaction } from '../../types';
import {
  getTransactionByIdApi,
  updateTransactionApi,
  deleteTransactionApi,
  mapTypeStringToNumber,
} from '../../services/transactionService';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  lang: 'pt' | 'en';
  onTransactionUpdated: (updatedTx: Transaction) => void;
  onTransactionDeleted: (txId: string) => void;
  addToast: (toast: any) => void;
}

export default function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
  lang,
  onTransactionUpdated,
  onTransactionDeleted,
  addToast,
}: EditTransactionModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [typeNum, setTypeNum] = useState<number>(1);
  const [transactionDate, setTransactionDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !transaction) return;

    setDescription(transaction.description || '');
    setAmount(String(transaction.value || ''));
    setTypeNum(transaction.type === 'income' ? 1 : 2);
    setTransactionDate(
      transaction.date?.includes('T')
        ? transaction.date
        : new Date().toISOString()
    );

    // If playgroundId exists, fetch fresh data via GetByIdTransaction endpoint
    if (transaction.playgroundId && transaction.id && !transaction.id.startsWith('t_')) {
      setIsLoading(true);
      getTransactionByIdApi(transaction.playgroundId, transaction.id)
        .then((fresh) => {
          if (fresh) {
            setDescription(fresh.description || '');
            setAmount(String(fresh.amount ?? ''));
            setTypeNum(fresh.type || 1);
            if (fresh.createdAt || fresh.transactionDate) {
              setTransactionDate(fresh.createdAt || fresh.transactionDate || '');
            }
          }
        })
        .catch((err) => {
          console.warn('getTransactionByIdApi fetch error:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, transaction]);

  if (!isOpen || !transaction) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError(lang === 'pt' ? 'Descrição é obrigatória.' : 'Description is required.');
      return;
    }

    const amtNum = Number(amount);
    if (isNaN(amtNum) || amtNum <= 0) {
      setError(lang === 'pt' ? 'Informe um valor maior que zero.' : 'Please enter an amount greater than zero.');
      return;
    }

    setIsSaving(true);

    const playId = transaction.playgroundId || 'bf900647-ea84-47db-bb44-b9d036815717';

    try {
      const res = await updateTransactionApi(playId, transaction.id, {
        description: description.trim(),
        amount: amtNum,
        type: Number(typeNum),
        transactionDate: transactionDate || new Date().toISOString(),
      });

      const updatedFrontendTx: Transaction = {
        ...transaction,
        description: res.description || description.trim(),
        value: Number(res.amount) || amtNum,
        type: res.type === 1 ? 'income' : 'expense',
        date: res.createdAt || res.transactionDate || transactionDate,
      };

      onTransactionUpdated(updatedFrontendTx);
      window.dispatchEvent(new CustomEvent('transaction:updated', { detail: { tx: updatedFrontendTx } }));
      addToast({
        type: 'success',
        title: lang === 'pt' ? 'Transação Atualizada' : 'Transaction Updated',
        message: lang === 'pt' ? 'Transação atualizada com sucesso no servidor!' : 'Transaction updated successfully!',
      });
      onClose();
    } catch (err: any) {
      console.error('Update transaction error:', err);
      setError(err.message || (lang === 'pt' ? 'Erro ao atualizar transação.' : 'Failed to update transaction.'));
      addToast({
        type: 'error',
        title: err.errorType || (lang === 'pt' ? 'Erro' : 'Error'),
        message: err.message || (lang === 'pt' ? 'Erro ao atualizar transação.' : 'Failed to update transaction.'),
        statusCode: err.statusCode,
        traceId: err.traceId,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    const playId = transaction.playgroundId || 'bf900647-ea84-47db-bb44-b9d036815717';

    try {
      await deleteTransactionApi(playId, transaction.id);

      onTransactionDeleted(transaction.id);
      window.dispatchEvent(new CustomEvent('transaction:deleted', { detail: { txId: transaction.id } }));
      addToast({
        type: 'success',
        title: lang === 'pt' ? 'Transação Excluída' : 'Transaction Deleted',
        message: lang === 'pt' ? 'Transação removida do servidor com sucesso.' : 'Transaction removed successfully.',
      });
      onClose();
    } catch (err: any) {
      console.error('Delete transaction error:', err);
      setError(err.message || (lang === 'pt' ? 'Erro ao excluir transação.' : 'Failed to delete transaction.'));
      setShowConfirmDelete(false);
      addToast({
        type: 'error',
        title: err.errorType || (lang === 'pt' ? 'Erro ao Excluir' : 'Delete Error'),
        message: err.message || (lang === 'pt' ? 'Erro ao excluir transação.' : 'Failed to delete transaction.'),
        statusCode: err.statusCode,
        traceId: err.traceId,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Box */}
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
                {lang === 'pt' ? 'Editar Transação' : 'Edit Transaction'}
              </h3>
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
              <span className="text-xs">{lang === 'pt' ? 'Carregando detalhes...' : 'Loading transaction details...'}</span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="font-semibold">{error}</p>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'pt' ? 'Descrição' : 'Description'}
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'pt' ? 'Valor' : 'Amount'}
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Type (1 = Income, 2 = Expense) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'pt' ? 'Tipo' : 'Type'}
                </label>
                <select
                  value={typeNum}
                  onChange={(e) => setTypeNum(Number(e.target.value))}
                  className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                >
                  <option value={1}>{lang === 'pt' ? '1 - Receita (Ganho)' : '1 - Income'}</option>
                  <option value={2}>{lang === 'pt' ? '2 - Despesa (Gasto)' : '2 - Expense'}</option>
                </select>
              </div>

              {/* Delete Confirmation Banner or Action Buttons */}
              {showConfirmDelete ? (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl space-y-3 animate-in fade-in zoom-in-95">
                  <p className="text-xs font-bold text-rose-800 dark:text-rose-200">
                    {lang === 'pt'
                      ? 'Tem certeza de que deseja excluir esta transação?'
                      : 'Are you sure you want to delete this transaction?'}
                  </p>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400">
                    {lang === 'pt' ? 'Esta ação não pode ser desfeita.' : 'This action cannot be undone.'}
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowConfirmDelete(false)}
                      disabled={isDeleting}
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {lang === 'pt' ? 'Cancelar' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{lang === 'pt' ? 'Excluindo...' : 'Deleting...'}</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{lang === 'pt' ? 'Sim, Excluir' : 'Yes, Delete'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    disabled={isDeleting}
                    className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{lang === 'pt' ? 'Excluir' : 'Delete'}</span>
                  </button>

                  <div className="flex items-center gap-2">
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
                          <Save className="w-4 h-4" />
                          <span>{lang === 'pt' ? 'Salvar' : 'Save'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
