import axios from "axios";

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:3000";
const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000; // 1 second

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const verifyUser = async (userId) => {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      // console.log(
      //   `Attempting to verify user with ID: ${userId} (Attempt ${retries + 1})`
      // );
      // console.log(`User service URL: ${USER_SERVICE_URL}`);

      const response = await axios.get(
        `${USER_SERVICE_URL}/api/users/${userId}`,
        { timeout: 5000 }
      );
      // console.log(`Response status: ${response.status}`);
      // console.log(`Response data: ${JSON.stringify(response.data)}`);

      if (response.data && response.data._id) {
        // console.log(`User verified successfully: ${userId}`);
        return response.data;
      } else {
        //  console.error(`Invalid user data received for user ID: ${userId}`);
        throw new Error("Invalid user data received");
      }
    } catch (error) {
      console.error(
        `Error in verifyUser (Attempt ${retries + 1}): ${error.message}`
      );

      // if (error.response) {
      //   console.error(`Response status: ${error.response.status}`);
      //   console.error(`Response data: ${JSON.stringify(error.response.data)}`);

      //   if (error.response.status === 404) {
      //     throw new Error(`User not found: ${userId}`);
      //   }
      // } else if (error.request) {
      //   console.error("No response received from user service");
      // } else {
      //   console.error("Error setting up the request");
      // }

      // if (error.code === "ECONNREFUSED") {
      //   console.error("Unable to connect to user service. Is it running?");
      // }

      // retries++;
      // if (retries < MAX_RETRIES) {
      //   const backoff = INITIAL_BACKOFF * Math.pow(2, retries);
      //   console.log(`Retrying in ${backoff}ms...`);
      //   await wait(backoff);
      // } else {
      //   throw new Error(
      //     `Failed to verify user after ${MAX_RETRIES} attempts: ${error.message}`
      //   );
      // }
    }
  }
};
