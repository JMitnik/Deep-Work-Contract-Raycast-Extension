export type Values = {
  name: string;
  duration: string;
  successMetric: string;
  hasHiddenPhone: boolean;
  stockedWater: boolean;
};

export interface FormValues {
  duration: string;
  successMetric: string;
  hasHiddenPhone: boolean;
  stockedWater: boolean;
  finishPrevious: boolean;
}

export interface Preferences {
  NOTION_DATABASE_ID: string;
  NOTION_API_KEY: string;
}

export type NotionPayload<T = any> = {
  object: 'page' | 'error';
  message: string;
  code: 'object_not_found' | 'validation_error';
} | {
  object: 'list';
  results: T[];
}

// export interface NotionPayload {
//   object: 'page' | 'error';
//   message: string;
//   code: 'object_not_found' | 'validation_error';
// }

// const contractPayload = {
//   parent: {
//     database_id: dbId,
//     type: 'database_id',
//   },
//   properties: {
//     "Name": {
//       title: [{ text: { content: values.name } }],
//     },
//     "Success Metric": {
//       "rich_text": [{ "text": { "content": values.successMetric } }],
//     },
//     "Duration": {
//       "number": Number(values.duration),
//     },
//     "Smartphone hidden": {
//       "checkbox": values.hasHiddenPhone,
//     },
//     "Water present": {
//       "checkbox": values.stockedWater,
//     },
//   }
// }

//
export interface ContractInput {
  parent: {
    database_id: string;
    type: 'database_id';
  };
  properties: {
    Name: {
      title: [{ text: { content: string } }];
    };
    'Success Metric': {
      rich_text: [{ text: { content: string } }];
    };
    Duration: {
      number: number;
    };
    'Smartphone hidden': {
      checkbox: boolean;
    };
    'Water present': {
      checkbox: boolean;
    };
  };
};