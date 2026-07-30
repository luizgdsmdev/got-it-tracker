import { apiFetch, parseApiError, ApiError } from './api';

export interface PlaygroundApiItem {
  playGroundId: string;
  ownerId: string;
  name: string;
  description: string;
  askForApproval: boolean;
  createdAt: string;
}

export interface CreatePlaygroundPayload {
  ownerId: string;
  name: string;
  description: string;
  askForApproval: boolean;
}

export interface UpdatePlaygroundPayload {
  name: string;
  description: string;
  askForApproval: boolean;
}

/**
 * POST /api/Playgrounds
 * Creates a new playground
 */
export async function createPlaygroundApi(
  payload: CreatePlaygroundPayload
): Promise<PlaygroundApiItem> {
  const res = await apiFetch('Playgrounds', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  return res.json();
}

/**
 * GET /api/Playgrounds/{playgroundId}
 * Gets a playground by ID
 */
export async function getPlaygroundByIdApi(
  playgroundId: string
): Promise<PlaygroundApiItem> {
  const res = await apiFetch(`Playgrounds/${playgroundId}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  return res.json();
}

/**
 * GET /api/Playgrounds/all
 * Gets all playgrounds
 */
export async function getAllPlaygroundsApi(): Promise<PlaygroundApiItem[]> {
  const res = await apiFetch('Playgrounds/all', {
    method: 'GET',
  });

  if (res.status === 404) {
    return [];
  }

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
 * GET /api/Playgrounds/user/{userId}
 * Gets playgrounds by userId
 */
export async function getUserPlaygroundsApi(
  userId?: string
): Promise<PlaygroundApiItem[]> {
  if (!userId) {
    return getAllPlaygroundsApi();
  }

  const res = await apiFetch(`Playgrounds/user/${userId}`, {
    method: 'GET',
  });

  if (res.status === 404) {
    return [];
  }

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
 * PATCH https://localhost:7189/toggle-approval/{playgroundId}
 * Toggles whether a playground requires transaction approval
 */
export async function toggleApprovalApi(
  playgroundId: string
): Promise<PlaygroundApiItem> {
  // Direct path or relative
  const directUrl = `https://localhost:7189/toggle-approval/${playgroundId}`;
  
  const res = await apiFetch(directUrl, {
    method: 'PATCH',
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  return res.json();
}

/**
 * PUT /api/Playgrounds/{playgroundId}
 * Updates playground name, description, askForApproval
 */
export async function updatePlaygroundApi(
  playgroundId: string,
  payload: UpdatePlaygroundPayload
): Promise<PlaygroundApiItem> {
  const res = await apiFetch(`Playgrounds/${playgroundId}`, {
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
 * DELETE /api/Playgrounds/{playgroundId}
 * Deletes a playground
 */
export async function deletePlaygroundApi(
  playgroundId: string
): Promise<any> {
  const res = await apiFetch(`Playgrounds/${playgroundId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const parsed = await parseApiError(res);
    throw new ApiError(parsed.message, parsed.statusCode, parsed.errorType, parsed.traceId);
  }

  return res.json();
}
