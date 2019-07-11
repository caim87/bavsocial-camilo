import * as Parse from 'parse';

export default () => {
  (Parse as any).serverURL = process.env.REACT_APP_SERVER_URL;

  if (
    process.env.REACT_APP_APP_ID !== undefined &&
    process.env.REACT_APP_JS_KEY !== undefined &&
    process.env.REACT_APP_MASTER_KEY !== undefined
  ) {
    Parse.initialize(
      process.env.REACT_APP_APP_ID,
      process.env.REACT_APP_JS_KEY,
      process.env.REACT_APP_MASTER_KEY
    );
  }
};
