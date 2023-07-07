const dotenv = require("dotenv");
dotenv.config();

const {
  UNIVERSE_ID,
  API_KEY,
  BANSTORE_KEY,
  CLIENT_ID,
  PLAYERDATA_KEY,
  TESTUNIVERSE_ID,
  TESTAPI_KEY,
  LIVERY_KEY,
  SERVERDATA_KEY,
} = process.env;
const { OpenCloud, DataStoreService } = require("rbxcloud");

OpenCloud.Configure({
  MessagingService: API_KEY,
  DataStoreService: API_KEY, // This is an API key for DataStoreService
  UniverseId: UNIVERSE_ID, // You can get the UniverseId from the Asset explorer
});
const BanDatastore = DataStoreService.GetDataStore(BANSTORE_KEY);
const PlayerDataStore = DataStoreService.GetDataStore(PLAYERDATA_KEY);
const ServerDataStore = DataStoreService.GetDataStore(SERVERDATA_KEY);
const LiveryDataStore = DataStoreService.GetDataStore(LIVERY_KEY);

module.exports.PlayerDataStore = PlayerDataStore;
module.exports.BanDataStore = BanDatastore;
module.exports.ServerDataStore = ServerDataStore;
module.exports.LiveryDataStore = LiveryDataStore;
