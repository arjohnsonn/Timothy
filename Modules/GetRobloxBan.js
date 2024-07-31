const { UserRestrictionsApi } = require("openblox/cloud");
const { updateConfig } = require("openblox/config");
const { UNIVERSE_ID, PLACE_ID, API_KEY } = process.env;

updateConfig({
  cloudKey: API_KEY,
});

function getUnixTimestamp(dateString) {
  // Parse the given date string into a Date object
  const date = new Date(dateString);

  // Get the Unix timestamp in milliseconds and convert to seconds
  const unixTimestamp = Math.floor(date.getTime() / 1000);

  return unixTimestamp;
}

module.exports = async (userId) => {
  const { data: restrictions } = await UserRestrictionsApi.restrictions({
    universeId: UNIVERSE_ID,
    placeId: PLACE_ID,
    userId: userId,
  });

  let duration = restrictions.gameJoinRestriction.duration ?? "Permanent";
  if (duration !== "Permanent") {
    duration = parseInt(duration);
  }

  let returnData = {
    startTime: restrictions.gameJoinRestriction.startTime,
    startTimeUnix: getUnixTimestamp(restrictions.gameJoinRestriction.startTime),
    duration: duration,
    privateReason: restrictions.gameJoinRestriction.privateReason,
    excludeAltAccounts: restrictions.gameJoinRestriction.excludeAltAccounts,
  };

  if (duration !== "Permanent") {
    returnData.endTimeUnix = returnData.startTimeUnix + duration;
  }

  return returnData;
};
