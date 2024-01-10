import { Form, ActionPanel, Action, showToast, Detail, openExtensionPreferences, Toast, popToRoot,   } from "@raycast/api";
import { v4 as uuidv4 } from 'uuid';
import { getPreferenceValues } from "@raycast/api";
import { startFocusSession } from "./integrations/focus";

import { updateExistingContracts, sendContractToNotion } from "./integrations/notion";
import { Preferences, FormValues, Values } from "./types";

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();

  async function handleSubmit({ finishPrevious, ...formValues }: FormValues) {
    await updateExistingContracts(preferences.NOTION_API_KEY, preferences.NOTION_DATABASE_ID, finishPrevious);

    const values: Values = {
      ...formValues,
      name: uuidv4(),
    }

    await sendContractToNotion(
      values,
      preferences.NOTION_API_KEY,
      preferences.NOTION_DATABASE_ID
    );

    startFocusSession(Number(values.duration));
    await showToast(Toast.Style.Success, `Session started! 🎉`);
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

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Start Session" onSubmit={handleSubmit} />
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
      <Form.TextArea id="successMetric" title="Success metric" placeholder="What is your objective? Define your success metric" />
      <Form.Separator />
      <Form.Description text="Mise en place: Prepare your workspace" />
      <Form.Checkbox id="hasHiddenPhone" title="Did you hide your phone?" label="Yes" />
      <Form.Checkbox id="stockedWater" title="Did you stock your water?" label="Yes" />
      <Form.Separator />
      <Form.Description text="Sessions streak: Continue or restart" />
      <Form.Checkbox id="finishPrevious" title="Mark previous as done?" label="Yes" defaultValue={true} />
    </Form>
  );
}