export interface Project {
  id: string;
  name: string;
  status?: string;
  description?: string;
  hubId?: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  urn?: string;
  objectId?: string;
  createTime?: string;
  lastModifiedTime?: string;
  size?: number;
  displayName?: string;
  versionNumber?: number;
}

export interface Folder {
  id: string;
  name: string;
  type: 'folders';
  displayName?: string;
}

export interface Hub {
  id: string;
  name: string;
  type: string;
  region?: string;
  attributes?: {
    name: string;
    region?: string;
    extension?: {
      type: string;
      version: string;
    };
  };
}

export interface Item {
  id: string;
  type: string;
  attributes: {
    name: string;
    displayName: string;
    createTime?: string;
    lastModifiedTime?: string;
    extension?: {
      type: string;
      version: string;
    };
  };
}

export interface Version {
  id: string;
  type: string;
  attributes: {
    name: string;
    displayName: string;
    versionNumber: number;
    createTime: string;
    lastModifiedTime: string;
    storageSize: number;
  };
  relationships?: {
    derivatives?: {
      data: {
        id: string;
      };
    };
  };
}

// 4D BIM Types
export interface Element4DProperties {
  elementId: string;
  elementName: string;
  externalId?: string;
  scheduledStartDate?: string;
  scheduledEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  phase?: string;
  discipline?: string;
  contractor?: string;
  status?: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  progress?: number; // 0-100
  notes?: string;
  customProperties?: Record<string, any>;
  databaseRecordId?: string;
}

export interface SchedulePhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
  description?: string;
}

export interface SelectedElement {
  dbId: number;
  name: string;
  externalId?: string;
  properties?: Element4DProperties;
}