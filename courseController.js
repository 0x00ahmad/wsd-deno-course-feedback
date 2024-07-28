import * as courseService from "./courseService.js";
import { eta } from "./eta.js";

export async function getAllCourses(c) {
  const courses = await courseService.getAllCourses();
  return c.html(eta.render("courses.eta", { courses }));
}

export async function createCourse(c) {
  const { name } = await c.req.parseBody();
  await courseService.addCourse(name);
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
