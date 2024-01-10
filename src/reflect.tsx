/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, ActionPanel, Action, Detail, openExtensionPreferences, popToRoot, Clipboard, showToast, Toast  } from "@raycast/api";
import { getPreferenceValues } from "@raycast/api";

import { useFetchNotion, defaultFilterOptions, parseLatestContract } from "./integrations/notion";
import { Preferences } from "./types";
import { useMemo } from "react";
import { useFetch } from "@raycast/utils";

export default function Command() {
  const preferences = getPreferenceValues<Preferences>() || {
    NOTION_API_KEY: '',
    NOTION_DATABASE_ID: '',
  };

  const notionDB = preferences.NOTION_DATABASE_ID ?? '';
  const notionAPI = preferences.NOTION_API_KEY ?? '';
  const filterOptions = defaultFilterOptions ?? {};

  const { data, isLoading } = useFetch(`https://api.notion.com/v1/databases/${notionDB}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${notionAPI}`,
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify(filterOptions),
  });

  const parsedData = useMemo(() => {
    if (isLoading) return {
        latestMission: "",
        latestDuration: 0,
        latestCreatedTime: new Date(),
    };

    return parseLatestContract(data as any)
    }, [data, isLoading]);

  const parsedDate = parsedData.latestCreatedTime ? new Date(parsedData.latestCreatedTime) : null;

    //   Parse date string as "Mon 12:00 PM, 10 Jan"
    const parsedDateStr = parsedDate ? parsedDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : null;

  async function handleSubmit({ succeeded, comment, nextSteps }: any) {
    /**
     * I want to format this to a Markdown string and copy it to the clipboard.
     * > [!session] Session at ${parsedDateStr} for ${parsedData.latestDuration} minutes
     * > Length: ${parsedData.latestDuration} minutes
     * > Goal: ${parsedData.latestMission}
     * > Success: ${succeeded ? "Yes" : "No"}
     * >
     * > Reflection:
     * > ${comment}
     * >
     * > Next steps:
     * > ${nextSteps}
     */

    const markdown = '> [!session] Session at ' + parsedDateStr + ' for ' + parsedData.latestDuration + ' minutes\n' +
    '> **Length**: ' + parsedData.latestDuration + ' minutes\n' + '> **Goal**: ' + parsedData.latestMission + '\n' + '> **Success**: ' + (succeeded ? "Yes" : "No") + '\n' +  '>' + '\n' +
    '> **Reflection**:\n' + '> ' + comment + '\n' + '>' + '\n' + '> **Next steps**:\n' + '> ' + nextSteps;

    await Clipboard.copy(markdown);
    showToast({ style: Toast.Style.Success, title: "Done!", message: 'Copied to clipboard' });

    await popToRoot();
  }

  if (!preferences.NOTION_API_KEY) {
    return (
      <Detail
        markdown="Please set your Notion API key in the preferences panel."
        actions={
          <ActionPanel>
            <Action title="Open Extension Preferences" onAction={openExtensionPreferences} />
          </ActionPanel>
        }
      />
    );
  }

  if (!preferences.NOTION_DATABASE_ID) {
    return (
      <Detail
        markdown="Please set the ID of your Notion Database containing your contracts."
        actions={
          <ActionPanel>
            <Action title="Open Extension Preferences" onAction={openExtensionPreferences} />
          </ActionPanel>
        }
      />
    );
  }

  if (isLoading) {
    return (
      <Detail
        markdown="Loading..."
      />
    );
  }

  if (!parsedData.latestCreatedTime && !isLoading) {
    return (
      <Detail
        markdown="No latest contract found."
        actions={
          <ActionPanel>
            <Action title="Open Extension Preferences" onAction={openExtensionPreferences} />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <Form
        actions={
            <ActionPanel>
               <Action.SubmitForm title="Format to Clipboard" onSubmit={handleSubmit} />
            </ActionPanel>
        }
    >
        <Form.Separator />

        <Form.Description text="About your last contract"  />

        {parsedData.latestCreatedTime && (
            <>
            <Form.Description title="When was this" text={parsedDateStr ?? ''}  />
            <Form.Description title="Your set goal" text={parsedData.latestMission}  />
            <Form.Description title="Your duration" text={`${parsedData.latestDuration} minutes`}  />
            </>
        )}
        <Form.Separator />

        <Form.Description text="Time to reflect"  />

        <Form.Checkbox autoFocus id="succeeded" title="Success achieved?" label="Yes" defaultValue={false} />

        <Form.TextArea id="comment" title="Reflection" placeholder="What went well? What could be improved?" />
        <Form.TextArea id="nextSteps" title="Next steps" placeholder="What are my next steps?" />

        </Form>
  );
}