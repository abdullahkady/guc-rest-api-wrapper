/*
  All credit goes to A.R. Maged: https://github.com/ar-maged/graphql-guc
*/

import R from 'ramda';
import toTitleCase from 'to-title-case';

const capitalize = str => [str[0].toUpperCase(), str.slice(1)].join('');

const augmentCoursework = coursework => course => R.assoc('coursework', R.filter(R.propEq('code', course.code))(coursework))(course);

const transformCourses = element => ({
  code: R.pipe(
    R.match(/\((.*?)\)/g),
    R.last,
    R.dropLast(1),
    R.tail,
  )(element.course_short_name),
  name: R.pipe(
    R.replace(/\((.*?)\)/g, ''),
    R.trim,
    toTitleCase,
  )(element.course_short_name),
});

const parseCourses = R.pipe(
  R.path(['data', 'd']),
  JSON.parse,
  R.prop('CurrentCourses'),
  R.map(transformCourses),
);

const transformCoursework = aggregation => R.pipe(
  R.map((element) => {
    const course = R.find(currentCourse => R.equals(currentCourse.sm_crs_id, element.sm_crs_id))(
      aggregation.CurrentCourses,
    );
    return {
      code: R.pipe(
        R.match(/\((.*?)\)/g),
        R.last,
        R.dropLast(1),
        R.tail,
      )(course.course_short_name),
      name: R.pipe(
        R.replace(/\((.*?)\)/g, ''),
        R.trim,
        toTitleCase,
      )(course.course_short_name),
      type: R.pipe(
        R.trim,
        capitalize,
      )(element.eval_method_name),
      grade: R.propEq('grade', '')(element) ? null : Number(element.grade),
      maximumGrade: Number(element.max_point),
    };
  }),
  R.reject(R.propEq('grade', null)),
)(aggregation.CourseWork);

const parseCoursework = R.pipe(
  R.path(['data', 'd']),
  JSON.parse,
  transformCoursework,
);

export default (courseworkResponse) => {
  const courses = parseCourses(courseworkResponse);
  const coursework = parseCoursework(courseworkResponse);

  return R.pipe(R.map(augmentCoursework(coursework)))(courses).map((course) => {
    course.coursework = course.coursework.map(({ type, grade, maximumGrade }) => ({
      type,
      grade,
      maximumGrade,
    }));
    return course;
  });
};
