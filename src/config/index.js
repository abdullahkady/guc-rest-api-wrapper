/*
  This module just initalizes the environment variables.
  To work with es6 module, check: https://github.com/motdotla/dotenv/issues/133#issuecomment-255298822
*/
import dotenv from 'dotenv';

dotenv.config();

const { PORT, GUC_COURSEWORK_API, GUC_TRANSCRIPT_API } = process.env;

const GUC_API_CONFIG = { clientVersion: '1.3', app_os: '0', os_version: '6.0.1' };

export {
  PORT, GUC_COURSEWORK_API, GUC_API_CONFIG, GUC_TRANSCRIPT_API,
};
