import React from 'react';
import { getApprovalStatusInfo } from '../../utils';

interface ApprovalStatusBadgeProps {
  status?: number;
  lang?: 'pt' | 'en';
  size?: 'sm' | 'md';
}

export default function ApprovalStatusBadge({
  status,
  lang = 'pt',
  size = 'sm',
}: ApprovalStatusBadgeProps) {
  const info = getApprovalStatusInfo(status, lang);

  const paddingClass = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[10px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold border rounded-full whitespace-nowrap transition-colors ${paddingClass} ${info.badgeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${info.dotClass}`} />
      <span>{info.label}</span>
    </span>
  );
}
