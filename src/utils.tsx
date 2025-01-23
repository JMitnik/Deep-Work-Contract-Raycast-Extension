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

export const formatReflect = ({
  comment,
  parsedDateString,
  succeeded,
  latestMission,
  duration,
  lastGoal
}: ReflectPayload) => {
    const goal = lastGoal || latestMission;

     // Split comment by newlines and prefix each line with "> "
     const formattedComment = comment
     .split('\n')
     .map(line => `> ${line}`)
     .join('\n');

     return [
      `> [!session] Session at ${parsedDateString}`,
      `> **Duration**: ${duration} minutes`,
      `> **Goal**: ${goal}`,
      `> **Success**: ${succeeded ? "Yes" : "No"}`,
      '>',
      '> **Reflection**:',
      formattedComment,
  ].join('\n');
};