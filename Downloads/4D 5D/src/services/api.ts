/**
 * API Service for communicating with the backend server
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001';

interface ApiResponse<T> {
  data: T;
}

/**
 * Fetch wrapper with error handling
 */
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

/**
 * Get access token for Forge Viewer
 */
export async function getAccessToken(): Promise<{ access_token: string; expires_in: number }> {
  return apiRequest('/api/token');
}

/**
 * List all hubs
 */
export async function listHubs(): Promise<ApiResponse<any[]>> {
  return apiRequest('/api/hubs');
}

/**
 * List projects in a hub
 */
export async function listProjects(hubId: string): Promise<ApiResponse<any[]>> {
  return apiRequest(`/api/hubs/${hubId}/projects`);
}

/**
 * Get top folders for a project
 */
export async function getTopFolders(hubId: string, projectId: string): Promise<ApiResponse<any[]>> {
  return apiRequest(`/api/projects/${projectId}/topFolders?hubId=${hubId}`);
}

/**
 * Get folder contents
 */
export async function getFolderContents(projectId: string, folderId: string): Promise<ApiResponse<any[]>> {
  return apiRequest(`/api/projects/${projectId}/folders/${folderId}/contents`);
}

/**
 * Get item versions
 */
export async function getItemVersions(projectId: string, itemId: string): Promise<ApiResponse<any[]>> {
  return apiRequest(`/api/items/${itemId}/versions?projectId=${projectId}`);
}

/**
 * Start translation job
 */
export async function startTranslation(urn: string): Promise<any> {
  return apiRequest('/api/modelderivative/translate', {
    method: 'POST',
    body: JSON.stringify({ urn }),
  });
}

/**
 * Get translation manifest
 */
export async function getManifest(urn: string): Promise<any> {
  return apiRequest(`/api/modelderivative/${encodeURIComponent(urn)}/manifest`);
}

/**
 * Check server health
 */
export async function checkHealth(): Promise<{ status: string; timestamp: string; hasCredentials: boolean }> {
  return apiRequest('/health');
}

/**
 * Convert model to IFC format
 */
export async function convertToIfc(urn: string): Promise<{ success: boolean; jobId: string; message?: string }> {
  return apiRequest('/api/modelderivative/convert-to-ifc', {
    method: 'POST',
    body: JSON.stringify({ urn }),
  });
}

/**
 * Check IFC conversion status
 */
export async function checkIfcConversionStatus(urn: string): Promise<{ status: string; downloadUrl?: string; message?: string }> {
  return apiRequest(`/api/modelderivative/${encodeURIComponent(urn)}/ifc-status`);
}

/**
 * Sync 4D properties to database
 */
export async function sync4DPropertiesToDatabase(elementId: number, properties: any): Promise<{ recordId: string; success: boolean }> {
  return apiRequest('/api/4d/properties', {
    method: 'POST',
    body: JSON.stringify({ elementId, properties }),
  });
}

/**
 * Get 4D properties from database
 */
export async function get4DPropertiesFromDatabase(elementId: number): Promise<any> {
  return apiRequest(`/api/4d/properties/${elementId}`);
}

/**
 * Get all 4D properties for a project
 */
export async function getAllProject4DProperties(projectId: string): Promise<any[]> {
  return apiRequest(`/api/4d/project/${projectId}/properties`);
}

export default {
  getAccessToken,
  listHubs,
  listProjects,
  getTopFolders,
  getFolderContents,
  getItemVersions,
  startTranslation,
  getManifest,
  checkHealth,
  convertToIfc,
  checkIfcConversionStatus,
  sync4DPropertiesToDatabase,
  get4DPropertiesFromDatabase,
  getAllProject4DProperties,
};
