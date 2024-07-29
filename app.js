import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import * as course from "./courseController.js";

const app = new Hono();

app.get("/courses", course.getAllCourses);
app.post("/courses", course.createCourse);
app.get("/courses/:id", course.getCourseById);
app.get("/courses/:cid/feedbacks/:fid", course.getCourseFeedbackById);
app.post("/courses/:cid/feedbacks/:fid", course.addCourseFeedback);
app.post("/courses/:id/delete", course.deleteCourseById);

// reset the KV store
// (async () => {
//   const kv = await Deno.openKv();
//   console.log("Clearing KV store");
//   const keys = kv.list({ prefix: [] });
//   for await (const entry of keys) {
//     await kv.delete(entry.key);
//   }
//   console.log("Cleared KV store");
// })();

export default app;
