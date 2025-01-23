
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
  GCAL_CLIENT_ID: string;
  GCAL_CALENDAR_ID: string;
  NOTION_DATABASE_ID: string;
  NOTION_API_KEY: string;
}

export interface ReflectPayload {
  contractId: string;
  latestMission: string;
  comment: string;
  parsedDateString: string;
  nextSteps: string;
  succeeded: boolean;
  duration: number;
  lastGoal?: string;
}

export type NotionPayload<T = any> = {
  object: 'page' | 'error';
  message: string;
  code: 'object_not_found' | 'validation_error';
} | {
  object: 'list';
  results: T[];
}

export interface NotionStringType {
  id: string;
  type: "rich_text";
  rich_text: Array<{
    type: string;
    text: {
      content: string;
      link: null | string;
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href: null | string;
  }>;
}

export interface NotionNumberType {
  id: string;
  type: "number";
  number: number;
}

export interface NotionCreatedTimeType {
  id: string;
  type: "created_time";
  created_time: string;
}

export interface Payload {
  "Success Metric": NotionStringType;
  "Duration": NotionNumberType;
  "Created time": NotionCreatedTimeType;
}


/**
 * Payload for actually "fetching"
 * 
 * {
  "object": "list",
  "results": [
    {
      "properties": {
        "-": {
          "id": "%3DFFK",
          "type": "rich_text",
          "rich_text": []
        },
        "Smartphone hidden": {
          "id": "IdI%5B",
          "type": "checkbox",
          "checkbox": true
        },
        "Duration": {
          "id": "Sx%5BL",
          "type": "number",
          "number": 15
        },
        "Tags": {
          "id": "T%7Cln",
          "type": "multi_select",
          "multi_select": []
        },
        "Location": {
          "id": "Ucyy",
          "type": "rich_text",
          "rich_text": []
        },
        "👍 Blocks successful": {
          "id": "VA%7Cc",
          "type": "number",
          "number": null
        },
        "Last updated": {
          "id": "VDR%3F",
          "type": "last_edited_time",
          "last_edited_time": "2024-01-10T17:17:00.000Z"
        },
        "Success Metric": {
          "id": "Yj_E",
          "type": "rich_text",
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "AG: Plan the next steps",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "AG: Plan the next steps",
              "href": null
            }
          ]
        },
        "Created time": {
          "id": "%5EQO%40",
          "type": "created_time",
          "created_time": "2024-01-10T17:17:00.000Z"
        },
        "💬 Post-contract note": {
          "id": "br%3C%7D",
          "type": "rich_text",
          "rich_text": []
        },
        "Goals successful": {
          "id": "hqAn",
          "type": "checkbox",
          "checkbox": false
        },
        "Cancel": {
          "id": "moqX",
          "type": "checkbox",
          "checkbox": false
        },
        "ID": {
          "id": "uzxB",
          "type": "unique_id",
          "unique_id": {
            "prefix": "DEV-DWC",
            "number": 499
          }
        },
        "Done": {
          "id": "vfR%7D",
          "type": "checkbox",
          "checkbox": false
        },
        "Water present": {
          "id": "%7Bk%7D%3E",
          "type": "checkbox",
          "checkbox": true
        },
        "Name": {
          "id": "title",
          "type": "title",
          "title": [
            {
              "type": "text",
              "text": {
                "content": "e0491497-60de-4f8d-acc8-5979c8612bb1",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "e0491497-60de-4f8d-acc8-5979c8612bb1",
              "href": null
            }
          ]
        }
      },
      "url": "https://www.notion.so/e0491497-60de-4f8d-acc8-5979c8612bb1-d1d9ecdb8fbd4ae3a9a50f9e11c325f3",
      "public_url": null
    }
  ],
  "next_cursor": null,
  "has_more": false,
  "type": "page_or_database",
  "page_or_database": {},
  "request_id": "50a07b81-bdcd-48c7-96e4-075f177de9c1"
*/

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