import { Hono } from "https://deno.land/x/hono@v3.12.11/mod.ts";
import * as course from "./courseController.js";

const app = new Hono();

// app.get("/", async (c) => {
//   const template = await eta.render("index.eta", {});
//   return c.html(template);
// });
//
// app.post("/feedbacks/:id", async (c) => {
//   const id = c.req.param("id");
//   await feedbacks.addFeedback(id);
//   return c.redirect("/");
// });
//
// app.get("/feedbacks/:id", async (c) => {
//   const id = c.req.param("id");
//   const count = await feedbacks.getFeedbackCount(id);
//   return c.text(`Feedback ${id}: ${count}`);
// });

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
