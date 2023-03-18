import { Form, ActionPanel, Action, showToast, Detail, openExtensionPreferences, Toast } from "@raycast/api";
import { getPreferenceValues } from "@raycast/api";

import { sendContractToNotion } from "./integrations/notion";
import { startFocusSession } from "./integrations/focus";
import { Preferences, Values } from "./types";

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();

  async function handleSubmit(values: Values) {
    await sendContractToNotion(
      values,
      preferences.NOTION_API_KEY,
      preferences.NOTION_DATABASE_ID
    );

    startFocusSession(Number(values.duration));
    showToast(Toast.Style.Success, `Session started! 🎉`);
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

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Session details: What is your session about?" />
      <Form.Dropdown id="duration" title="Duration" defaultValue="25">
        <Form.Dropdown.Item value="15" title="Mini-pomodoro (15min)" icon="🚶‍♂️" />
        <Form.Dropdown.Item value="25" title="Pomodoro (25min)" icon="🤔" />
        <Form.Dropdown.Item value="50" title="Super-pomodoro (50min)" icon="✍️" />
        <Form.Dropdown.Item value="100" title="Ultra-pomodoro (100min)" icon="🧠" />
      </Form.Dropdown>
      <Form.TextField id="name" title="Name" placeholder="What is your session about?" />
      <Form.TextArea id="successMetric" title="Success metric" placeholder="What is your objective? Define your success metric" />
      <Form.Separator />
      <Form.Description text="Mise en place: Prepare your workspace" />
      <Form.Checkbox id="hasHiddenPhone" title="Did you hide your phone?" label="Yes" />
      <Form.Checkbox id="stockedWater" title="Did you stock your water?" label="Yes" />
    </Form>
  );
}