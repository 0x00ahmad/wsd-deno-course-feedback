import * as courseService from "./courseService.js";
import { eta } from "./eta.js";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const courseSchema = z.object({
  name: z.string().min(4, {
    message: "The course name should be a string of at least 4 characters.",
  }),
});

export async function getAllCourses(c) {
  const courses = await courseService.getAllCourses();
  return c.html(eta.render("courses.eta", { courses, prevData: { name: "" } }));
}

export async function createCourse(c) {
  const body = await c.req.parseBody();
  const result = courseSchema.safeParse(body);
  if (!result.success) {
    return c.html(
      eta.render("courses.eta", {
        courses: await courseService.getAllCourses(),
        prevData: body,
        errors: result.error.format(),
      }),
    );
  }
  await courseService.addCourse(result.data.name);
  return c.redirect("/courses");
}

export async function getCourseById(c) {
  const id = c.req.param("id");
  console.log(`Getting course with id: ${id}`);
  const course = await courseService.getCourseById(id);
  if (!id || !course || !course.id) {
    return c.redirect("/courses");
  }
  return c.html(eta.render("course.eta", { course }));
}

export async function deleteCourseById(c) {
  const id = c.req.param("id");
  await courseService.deleteCourse(id);
  return c.redirect("/courses");
}

export async function getCourseFeedbackById(c) {
  const courseId = c.req.param("cid");
  const feedbackId = c.req.param("fid");
  const count = await courseService.getCourseFeedback(courseId, feedbackId);
  return c.text(`Feedback ${feedbackId}: ${count}`);
}

export async function addCourseFeedback(c) {
  const courseId = c.req.param("cid");
  const feedbackId = c.req.param("fid");
  console.log(`Adding feedback ${feedbackId} to course ${courseId}`);
  await courseService.addCourseFeedback(courseId, feedbackId);
  return c.redirect(`/courses/${courseId}`);
}
