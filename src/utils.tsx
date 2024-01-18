import { ReflectPayload } from "./types";

export const parseDateString = (dateString: string|null): string|null => {
    const parsedDate = dateString ? new Date(dateString) : null;

    const parsedDateStr = parsedDate ? parsedDate.toLocaleString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    }) : null;

    return parsedDateStr;
};

export const formatReflect = ({ comment, duration, nextSteps, parsedDateString, succeeded, latestMission }: ReflectPayload) => {
    return '> [!session] Session at ' + parsedDateString + ' for ' + duration + ' minutes\n' +
    '> **Length**: ' + duration + ' minutes\n' + '> **Goal**: ' + latestMission + '\n' + '> **Success**: ' + (succeeded ? "Yes" : "No") + '\n' +  '>' + '\n' +
    '> **Reflection**:\n' + '> ' + comment + '\n' + '>' + '\n' + '> **Next steps**:\n' + '> ' + nextSteps;
}