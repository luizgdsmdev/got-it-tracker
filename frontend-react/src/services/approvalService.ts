import { apiFetch, parseApiError, ApiError } from './api';
import { Approval } from '../types';

export interface ApiApprovalRequest {
  id: string;
  personId: string;
  transactionId?: string;
  playgroundId?: string;
  description: string;
  amount: number;
  type: number; // 1 = Income, 2 = Expense
  status: number; // 0 = Pending, 1 = Approved, 2 = Rejected
  isPublic: boolean;
  requestedAt: string;
  reviewedAt: string;
  requestedBy?: string | null;
  reviewedBy?: string | null;
  requestedById?: string | null;
  reviewedById?: string | null;
  reasonDescription?: string | null;
}

export interface ApproveRequestPayload {
  approvalRequestId: string;
  reasonDescription: string;
}

export interface RejectRequestPayload {
  rejectRequestId: string;
  reasonDescription: string;
}

/**
 * Maps backend ApiApprovalRequest to frontend Approval model
 */
export function mapApiApprovalToFrontend(
  apiApp: ApiApprovalRequest,
  playgroundName = 'Playground',
  people: { id: string; email?: string; name: string }[] = []
): Approval {
  let statusStr: 'pending' | 'approved' | 'rejected' = 'pending';
  if (apiApp.status === 1) statusStr = 'approved';
  else if (apiApp.status === 2) statusStr = 'rejected';

  let requesterName = apiApp.requestedBy || apiApp.requestedById || '';
  if (!requesterName || requesterName === 'Membro' || requesterName.length > 20) {
    const foundPerson = people.find((p) => p.id === apiApp.personId || p.email === apiApp.personId);
    if (foundPerson) {
      requesterName = foundPerson.name;
    } else if (apiApp.personId) {
      if (apiApp.personId.includes('@')) {
        const prefix = apiApp.personId.split('@')[0];
        requesterName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      } else {
        requesterName = apiApp.personId;
      }
    }
  }

  if (!requesterName) {
    requesterName = 'Membro';
  } else if (requesterName.includes('@')) {
    const prefix = requesterName.split('@')[0];
    requesterName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }

  let reviewerName = apiApp.reviewedBy || apiApp.reviewedById || '';
  if (!reviewerName) {
    reviewerName = statusStr === 'pending' ? 'Pendente' : 'Gestor';
  } else if (reviewerName.includes('@')) {
    const prefix = reviewerName.split('@')[0];
    reviewerName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }

  return {
    id: apiApp.id,
    title: apiApp.description || 'Solicitação de Transação',
    playgroundName: playgroundName,
    playgroundId: apiApp.playgroundId,
    value: Number(apiApp.amount) || 0,
    type: apiApp.type === 1 ? 'income' : 'expense',
    requesterName,
    reviewerName,
    visibility: apiApp.isPublic ? 'Public' : 'Private',
    publicToggle: apiApp.isPublic,
    description: apiApp.description || '',
    reason: apiApp.reasonDescription || '',
    status: statusStr,
    personId: apiApp.personId,
    requestedAt: apiApp.requestedAt,
  };
}

/**
 * GET /api/ApprovalRequests/playground/{playgroundId}
 * Retrieves all approval requests for a specific playground
 */
export async function getApprovalRequestsByPlaygroundIdApi(
  playgroundId: string
): Promise<ApiApprovalRequest[]> {
  const res = await apiFetch(`ApprovalRequests/playground/${playgroundId}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  return res.json();
}

/**
 * GET /api/ApprovalRequests/{approvalRequestId}
 * Retrieves a single approval request by ID
 */
export async function getApprovalRequestByIdApi(
  approvalRequestId: string
): Promise<ApiApprovalRequest> {
  const res = await apiFetch(`ApprovalRequests/${approvalRequestId}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  return res.json();
}

/**
 * PUT /api/ApprovalRequests/approve
 * Approves a pending approval request
 */
export async function approveApprovalRequestApi(
  payload: ApproveRequestPayload
): Promise<ApiApprovalRequest> {
  const res = await apiFetch('ApprovalRequests/approve', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  return res.json();
}

/**
 * PUT /api/ApprovalRequests/reject
 * Rejects a pending approval request
 */
export async function rejectApprovalRequestApi(
  payload: RejectRequestPayload
): Promise<ApiApprovalRequest> {
  const res = await apiFetch('ApprovalRequests/reject', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  return res.json();
}
