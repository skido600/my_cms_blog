import { notifySubscribersOfNewPost } from "../src/controller/subscriber-notifications";

type PostInput = { title: string; excerpt?: string | null; slug: string };

async function sendNotifications(post: PostInput) {
  "use step";
  return await notifySubscribersOfNewPost(post);
}

export async function newPostWorkflow(post: PostInput) {
  "use workflow";
  await sendNotifications(post);
}
