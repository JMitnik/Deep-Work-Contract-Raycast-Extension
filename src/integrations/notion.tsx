import { showToast, Toast } from "@raycast/api";
import fetch from "node-fetch";
import { Values, NotionPayload, ContractInput, NotionStringType, NotionNumberType, NotionCreatedTimeType } from "../types";
import { useFetch } from "@raycast/utils";

const fetchNotion = async <Output, Input>(
  url: string,
  apiKey: string,
  data: Input,
  method = 'POST',
): Promise<Output> => {
  const response = await fetch(url, {
    method,
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

export const readString = (data: NotionStringType): string => {
  return data.rich_text[0].plain_text;
};

export const readNumber = (data: NotionNumberType): number => {
  return data.number;
};

export const readDate = (data: NotionCreatedTimeType): Date => {
  return new Date(data.created_time);
};

interface FilterItem {
  property: string;
  checkbox: {
    equals: boolean;
  };
}

interface FilterInput {
  filter: {
    and?: Array<FilterItem>;
  }
}

export const defaultFilterOptions: FilterInput = {
  "filter": {
    "and": [
      {
        "property": "Done",
        "checkbox": {
          "equals": false
        },
      },
      {
        "property": "Cancel",
        "checkbox": {
          "equals": false
        },
      },
    ]
  }
}

export const useFetchNotion = (url: string, apiKey: string, options: any) => {
  const { data, isLoading } = useFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify(options),
  });

  return { data, isLoading };
};

export const parseLatestContract = (data: NotionPayload): Record<string, any> => {
  if (!data || !data.object) {
    showToast({ style: Toast.Style.Failure, title: "Error", message: 'No data / data object' });
  }

  if (data.object === "error") {
    showToast({ style: Toast.Style.Failure, title: "Error", message: data.message });
  }

  if (data.object === "list") {
    if (!data.results || data.results.length === 0) {
      return {
        latestMission: "",
        latestDuration: 0,
        latestCreatedTime: new Date(),
      }
    }

    const result = data.results[0];

    const latestResult = data.results[0];

    const latestMission = readString(latestResult.properties["Success Metric"]);
    const latestDuration = readNumber(latestResult.properties["Duration"]);
    const latestCreatedTime = readDate(latestResult.properties["Created time"]);

    return {
      latestMission,
      latestDuration,
      latestCreatedTime,
    };
  }

  return {
    latestMission: "",
    latestDuration: 0,
    latestCreatedTime: new Date(),
  }
};

export const updateExistingContracts = async (apiKey: string, dbId: string, finishPrevious: boolean) => {
  const notionUrl = `https://api.notion.com/v1/databases/${dbId}/query`;

  const filter: FilterInput = {
    "filter": {
      "and": [
        {
          "property": "Done",
          "checkbox": {
            "equals": false
          },
        },
        {
          "property": "Cancel",
          "checkbox": {
            "equals": false
          },
        },
      ]
    }
  };

  try {
    const data = await fetchNotion<NotionPayload, FilterInput>(notionUrl, apiKey, filter, 'POST');
    if (data.object === "error") {
      showToast({ style: Toast.Style.Failure, title: "Error", message: data.message });
    }

    if (data.object === "list") {
      // Loop through the results and mark them as done.
      data.results.forEach(async (result) => {
        const contractId = result.id;
        const updateUrl = `https://api.notion.com/v1/pages/${contractId}`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatePayload: any = {
          properties: {}
        };

        if (finishPrevious) {
          updatePayload.properties['Done'] = {
            checkbox: true,
          }
        } else {
          updatePayload.properties['Cancel'] = {
            checkbox: true,
          }
        }

        try {
          const updateData = await fetchNotion<NotionPayload, typeof updatePayload>(updateUrl, apiKey, updatePayload, 'PATCH');
          if (updateData.object === "error") {
            showToast({ style: Toast.Style.Failure, title: "Error", message: updateData.message });
          }
        } catch (error) {
          showToast({ style: Toast.Style.Failure, title: "Error", message: "See logs for error" });
        }
      });
    }
    return data;
  } catch (error) {
    showToast({ style: Toast.Style.Failure, title: "Error", message: "See logs for error" });
    return null;
  }
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