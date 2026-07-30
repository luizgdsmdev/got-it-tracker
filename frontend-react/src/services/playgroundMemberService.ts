import { apiFetch, parseApiError, ApiError } from './api';

export interface PlaygroundMemberApiItem {
  playGroundId: string;
  personId: string;
  isAdmin: boolean;
  joinedAt: string;
  role: number;
  userId?: string | null;
  name?: string;
  age?: number;
}

export interface CreateMemberPayload {
  name: string;
  age: number;
}

export interface InviteMemberPayload {
  email: string;
  role: number;
}

export interface UpdateMemberPayload {
  role: number;
  isAdmin: boolean;
}

export enum PlaygroundRole {
  Viewer = 1,
  Contributor = 2,
  Manager = 3,
  Owner = 4,
}

export function getRoleName(roleNum: number, lang: 'pt' | 'en' = 'pt'): string {
  switch (roleNum) {
    case 1:
      return lang === 'pt' ? 'Viewer' : 'Viewer';
    case 2:
      return lang === 'pt' ? 'Contributor' : 'Contributor';
    case 3:
      return lang === 'pt' ? 'Manager' : 'Manager';
    case 4:
      return lang === 'pt' ? 'Owner' : 'Owner';
    default:
      return 'Viewer';
  }
}

export function getRoleNumber(role: string | number): number {
  if (typeof role === 'number') return role;
  const lower = String(role).toLowerCase();
  if (lower.includes('contributor') || lower.includes('colaborador')) return 2;
  if (lower.includes('manager') || lower.includes('gestor')) return 3;
  if (lower.includes('owner') || lower.includes('proprietário') || lower.includes('proprietario')) return 4;
  return 1; // Default Viewer
}

async function parseJsonResponseSafely<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text || !text.trim()) {
    return {} as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

/**
 * GET /api/PlayGroundMember/all-members/{playgroundId}
 * Fetch all members associated with a playground
 */
export async function getAllMembersByPlaygroundApi(
  playgroundId: string
): Promise<PlaygroundMemberApiItem[]> {
  const res = await apiFetch(`PlayGroundMember/all-members/${playgroundId}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  const text = await res.text();
  if (!text || !text.trim()) return [];
  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}

/**
 * POST /api/PlayGroundMember/{playgroundID}
 * Create a new guest member in a playground
 */
export async function createMemberApi(
  playgroundId: string,
  payload: CreateMemberPayload
): Promise<PlaygroundMemberApiItem> {
  const res = await apiFetch(`PlayGroundMember/${playgroundId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  return parseJsonResponseSafely<PlaygroundMemberApiItem>(res);
}

/**
 * GET /api/PlayGroundMember/{playGroundId}/{personId}
 * Fetch specific playground member details
 */
export async function getMemberApi(
  playgroundId: string,
  personId: string
): Promise<PlaygroundMemberApiItem> {
  const res = await apiFetch(`PlayGroundMember/${playgroundId}/${personId}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  return parseJsonResponseSafely<PlaygroundMemberApiItem>(res);
}

/**
 * POST /api/PlayGroundMember/{playGroundId}/invite
 * Invite a user by email to a playground
 */
export async function inviteUserApi(
  playgroundId: string,
  payload: InviteMemberPayload
): Promise<PlaygroundMemberApiItem> {
  const res = await apiFetch(`PlayGroundMember/${playgroundId}/invite`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  return parseJsonResponseSafely<PlaygroundMemberApiItem>(res);
}

/**
 * PUT /api/PlayGroundMember/{playGroundId}/{PersonID}
 * Update a member's role or admin status in a playground
 */
export async function updateMemberApi(
  playgroundId: string,
  personId: string,
  payload: UpdateMemberPayload
): Promise<PlaygroundMemberApiItem> {
  const res = await apiFetch(`PlayGroundMember/${playgroundId}/${personId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  return parseJsonResponseSafely<PlaygroundMemberApiItem>(res);
}

/**
 * DELETE /api/PlayGroundMember/{playGroundId}/{PersonID}
 * Remove a member from a playground
 */
export async function deleteMemberApi(
  playgroundId: string,
  personId: string
): Promise<PlaygroundMemberApiItem> {
  const res = await apiFetch(`PlayGroundMember/${playgroundId}/${personId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  return parseJsonResponseSafely<PlaygroundMemberApiItem>(res);
}
