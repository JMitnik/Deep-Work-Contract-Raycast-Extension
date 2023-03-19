import { showToast, Toast } from "@raycast/api";
import fetch from "node-fetch";
import { Values, NotionPayload, ContractInput } from "../types";

const fetchNotion = async <Output, Input>(
  url: string,
  apiKey: string,
  data: Input
): Promise<Output> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json() as Output;

  return responseData;
};

export const fetchAvailableContracts = async (apiKey: string, dbId: string) => {
  const notionUrl = `https://api.notion.com/v1/databases/${dbId}/query`;

  // Filter that "Cancel" and "Done" are not checked
  const filterInput = {
    filter: {
      and: [
        {
          property: "Cancel",
          checkbox: {
            equals: false,
          },
        },
        {
          property: "Done",
          checkbox: {
            equals: false,
          },
        }
      ]
    },
  };
};


/**
 * Sends the notion contract to the database of contracts.
 * @param values - The values from the form.
 * @param apiKey - The Notion API key.
 * @param dbId - The Notion database ID.
 */
export const sendContractToNotion = async (values: Values, apiKey: string, dbId: string) => {
    const notionUrl = 'https://api.notion.com/v1/pages';

    const contractPayload: ContractInput = {
      parent: {
        database_id: dbId,
        type: 'database_id',
      },
      properties: {
        "Name": {
          title: [{ text: { content: values.name } }],
        },
        "Success Metric": {
          "rich_text": [{ "text": { "content": values.successMetric } }],
        },
        "Duration": {
          "number": Number(values.duration),
        },
        "Smartphone hidden": {
          "checkbox": values.hasHiddenPhone,
        },
        "Water present": {
          "checkbox": values.stockedWater,
        },
      }
    };

    try {
      const data = await fetchNotion<NotionPayload, ContractInput>(notionUrl, apiKey, contractPayload);

      if (data.object === "error") {
        showToast({ style: Toast.Style.Failure, title: "Error", message: data.message });
        throw new Error(JSON.stringify(values));
      }
      return data;
    } catch (error) {
      showToast({ style: Toast.Style.Failure, title: "Error", message: "See logs for error" });
      return null;
    }
  }