const setupCheck = () => {
  const {
    NEXTAUTH_SECRET: authSecret,
    GOOGLE_CLIENT_ID: googleId,
    GOOGLE_CLIENT_SECRET: googleSecret,
    DATABASE_URL: databaseURL,
  } = process.env;

  let errorCount = 0;
  let errorMessage = [];

  if (typeof authSecret === "undefined") {
    const message = " ---> NEXTAUTH_SECRET is undefined.";
    console.error(message);
    errorMessage.push(message);
    errorCount++;
  }
  if (typeof googleId === "undefined") {
    const message = "---> GOOGLE_CLIENT_ID is undefined.";
    console.error(message);
    errorMessage.push(message);
    errorCount++;
  }
  if (typeof googleSecret === "undefined") {
    const message = "---> GOOGLE_CLIENT_SECRET is undefined.";
    console.error(message);
    errorMessage.push(message);
    errorCount++;
  }
  if (typeof databaseURL === "undefined") {
    const message = "---> Database string is undefined.";
    console.error(message);
    errorMessage.push(message);
    errorCount++;
  }

  if (errorCount > 4) {
    const message =
      "\n\n\n\n--> .env file is either not reachable or not setup properly. Please refer to .env.example file for the setup.\n\n\n\n";
    console.error(message);
  }

  if (errorCount == 0) {
    console.log("--> Setup checks passed successfully.");
  } else {
    throw new Error(errorMessage[errorMessage.length - 1]);
  }
};

module.exports = setupCheck;
