/*
  All credit goes to A.R. Maged: https://github.com/ar-maged/graphql-guc
*/

import R from 'ramda';
import toTitleCase from 'to-title-case';

const transformTranscript = (aggregation) => {
  if (
    R.pipe(
      R.head,
      R.prop('error'),
    )(aggregation)
  ) {
    return null;
  }
  return {
    cumulativeGPA: aggregation.CumGPA,
    semesters: R.pipe(
      R.map((element) => {
        const semester = R.find(R.propEq('season_id', element.season_id))(aggregation.Transcript);
        return {
          year: R.pipe(
            R.prop('Semester'),
            R.split(' '),
            R.takeLast(1),
            R.join(''),
            Number,
          )(semester),
          type: R.pipe(
            R.prop('Semester'),
            R.split(' '),
            R.take(1),
            R.join(''),
            R.toUpper,
          )(semester),
          gpa: element.gpa,
          courses: R.pipe(
            R.filter(R.eqProps('Semester', semester)),
            R.map(entry => ({
              course: {
                code: R.replace(/\s/g, '', entry.course_code),
                name: R.pipe(
                  R.trim,
                  toTitleCase,
                )(entry.course_name),
              },
              grade: {
                german: Number(entry.de_result),
                american: entry.us_result,
              },
              creditHours: Number(entry.total_h),
            })),
          )(aggregation.Transcript),
        };
      }),
      R.uniqWith(R.allPass([R.eqProps('year'), R.eqProps('type')])),
    )(aggregation.GPAPerSn),
  };
};

const parseTranscript = R.pipe(
  R.path(['data', 'd']),
  JSON.parse,
  transformTranscript,
);

export default transcriptResponse => parseTranscript(transcriptResponse);
