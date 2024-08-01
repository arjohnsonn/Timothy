const { UserRestrictionsApi } = require("openblox/cloud");
const { updateConfig } = require("openblox/config");
const { v4: uuidv4 } = require("uuid");
const { UNIVERSE_ID, PLACE_ID, API_KEY } = process.env;

updateConfig({
  cloudKey: API_KEY,
});

module.exports = async (
  userId,
  duration,
  privateReason,
  displayReason,
  excludeAltAccounts,
  active
) => {
  const idempotencyKey = uuidv4(),
    firstSent = new Date();

  return await UserRestrictionsApi.updateRestrictionsForUser({
    universeId: UNIVERSE_ID,
    placeId: PLACE_ID,
    userId,
    idempotencyKey,
    firstSent,
    updatedData: {
      gameJoinRestriction: {
        active: active,
        duration: duration,
        privateReason,
        displayReason,
        excludeAltAccounts: excludeAltAccounts,
      },
    },
  });
};
