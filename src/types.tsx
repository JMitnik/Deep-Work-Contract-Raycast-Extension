export type Values = {
  name: string;
  duration: string;
  successMetric: string;
  hasHiddenPhone: boolean;
  stockedWater: boolean;
};


export interface Preferences {
  NOTION_DATABASE_ID: string;
  NOTION_API_KEY: string;
}


export interface NotionPayload {
  object: 'page' | 'error';
  message: string;
  code: 'object_not_found' | 'validation_error';
}