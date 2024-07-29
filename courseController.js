import * as courseService from "./courseService.js";
import { eta } from "./eta.js";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { getUsersSession } from "./session.js";

// @type {Map<string, string[]>}
export const feedbackSessions = new Map();

const courseSchema = z.object({
  name: z.string().min(4, {
    message: "The course name should be a string of at least 4 characters.",
  }),
});

export async function getAllCourses(c) {
  await getUsersSession(c);
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
  const sessionId = await getUsersSession(c);
  const id = c.req.param("id");
  console.log(`Getting course with id: ${id}`);
  const course = await courseService.getCourseById(id);
  if (!id || !course || !course.id) {
    return c.redirect("/courses");
  }
  const alreadyGaveFeedbackForThisCourse =
    await courseService.hasUserAlreadyGivenFeedbackForCourse(
      sessionId,
      course.id,
    );
  return c.html(
    eta.render("course.eta", { course, alreadyGaveFeedbackForThisCourse }),
  );
}

export async function deleteCourseById(c) {
  const id = c.req.param("id");
  await courseService.deleteCourse(id);
  return c.redirect("/courses");
}

export async function addCourseFeedback(c) {
  const sessionId = await getUsersSession(c);
  const courseId = c.req.param("cid");
  const feedbackId = c.req.param("fid");
  console.log(`Adding feedback ${feedbackId} to course ${courseId}`);
  await courseService.addCourseFeedback(courseId, feedbackId);
  await courseService.setFeedbackGivenToTrueForUserForCourse(
    sessionId,
    courseId,
  );
  return c.redirect(`/courses/${courseId}`);
}

export async function getCourseFeedbackById(c) {
  const courseId = c.req.param("cid");
  const feedbackId = c.req.param("fid");
  const count = await courseService.getCourseFeedback(courseId, feedbackId);
  return c.text(`Feedback ${feedbackId}: ${count}`);
}
