const kv = await Deno.openKv();

const basePrefix = "courses";

const FEEDBACK_IDS = [1, 2, 3, 4, 5];

function getDefaultFeedbacks() {
  const out = {};
  for (const fid of FEEDBACK_IDS) {
    out[fid] = 0;
  }
  return out;
}

export const getAllCourses = async () => {
  const entries = await kv.list({ prefix: [basePrefix] });
  const out = [];
  for await (const entry of entries) {
    if (!entry.value) continue;
    out.push(entry.value);
  }
  console.log(`Returning ${out.length} courses`);
  return out;
};

export const addCourse = async (name) => {
  const newCourse = {
    id: crypto.randomUUID(),
    name,
    feedbacks: getDefaultFeedbacks(),
  };
  console.log(`Creating course: ${JSON.stringify(newCourse)}`);
  await kv.set([basePrefix, newCourse.id], newCourse);
};

export const getCourseById = async (id) => {
  const out = await kv.get([basePrefix, id]);
  return out?.value ?? {};
};

export const deleteCourse = async (id) => {
  console.log(`Deleting course with id: ${id}`);
  await kv.delete([basePrefix, id]);
};

export async function getCourseFeedback(cid, fid) {
  const course = await getCourseById(cid);
  if (!course.id) {
    console.log(`Course with id ${cid} not found`);
    return 0;
  }
  return course.feedbacks[fid] || 0;
}

export async function addCourseFeedback(cid, fid) {
  const course = await getCourseById(cid);
  if (!course.id) {
    console.log(`Course with id ${cid} not found`);
    return;
  }
  const feedbacks = course.feedbacks;
  const count = feedbacks[fid] || 0;
  feedbacks[fid] = count + 1;
  course.feedbacks = feedbacks;
  console.log(`Updated course: ${JSON.stringify(course)}`);
  await kv.set([basePrefix, course.id], course);
  console.log(`Added feedback ${fid} to course ${cid}`);
}

export async function setFeedbackGivenToTrueForUserForCourse(sid, cid) {
  await kv.set([basePrefix, cid, sid], true);
}

export async function hasUserAlreadyGivenFeedbackForCourse(sid, cid) {
  console.log(sid, cid);
  const res = await kv.get([basePrefix, cid, sid]);
  return !!res && !!res.value;
}
