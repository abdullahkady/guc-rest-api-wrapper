import axios from 'axios';
import { OK, UNAUTHORIZED } from 'http-status';
import { GUC_COURSEWORK_API, GUC_TRANSCRIPT_API, GUC_API_CONFIG } from './config';
import courseworkParser from './parser/coursework';
import transcriptParser from './parser/transcript';

// This is the response returned by the GUC API when invalid credentials are used ._.
const isNotAuthroized = response => response.data.d === '[{"error":"Unauthorized"}]';

const getCourses = async (username, password) => {
  try {
    const courseworkResponse = await axios.post(GUC_COURSEWORK_API, {
      ...GUC_API_CONFIG,
      username,
      password,
    });

    if (isNotAuthroized(courseworkResponse)) {
      const err = new Error('Invalid credentials');
      err.status = UNAUTHORIZED;
      throw err;
    }

    return courseworkParser(courseworkResponse);
  } catch (err) {
    throw err;
  }
};

const getTranscript = async (username, password) => {
  try {
    const transcriptResponse = await axios.post(GUC_TRANSCRIPT_API, {
      ...GUC_API_CONFIG,
      username,
      password,
    });

    if (isNotAuthroized(transcriptResponse)) {
      const err = new Error('Invalid credentials');
      err.status = UNAUTHORIZED;
      throw err;
    }

    return transcriptParser(transcriptResponse);
  } catch (err) {
    throw err;
  }
};

const retrieveCourses = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const courses = await getCourses(username, password);
    return res.status(OK).json({ courses });
  } catch (err) {
    return next(err);
  }
};

const retrieveTranscript = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const transcript = await getTranscript(username, password);
    return res.status(OK).json({ transcript });
  } catch (err) {
    return next(err);
  }
};

export default {
  retrieveCourses,
  retrieveTranscript,
};
