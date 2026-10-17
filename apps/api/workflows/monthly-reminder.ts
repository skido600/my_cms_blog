import { sleep } from "workflow";
import { start } from "workflow/api";
import { sendMonthlyUnsubscribeReminder } from "../src/controller/subscriber-notifications";

// 09:00 UTC on the 1st of next month (10:00 in Lagos)
async function getNextMonthStart() {
  "use step";
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 9);
}

async function sendReminders() {
  "use step";
  return await sendMonthlyUnsubscribeReminder();
}

async function scheduleNextCycle() {
  "use step";
  await start(monthlyReminderWorkflow, []);
}

export async function monthlyReminderWorkflow() {
  "use workflow";

  const wakeAt = await getNextMonthStart();
  await sleep(new Date(wakeAt));

  await scheduleNextCycle(); // chain survives even if sending fails
  await sendReminders();
}
