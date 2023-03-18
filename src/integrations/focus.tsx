import { execSync } from "child_process";

export const startFocusSession = (duration: number) => {
    execSync('shortcuts run "Focus: Work"');
    execSync(`open focus://focus?minutes=${duration}`, { stdio: 'ignore' });
  };