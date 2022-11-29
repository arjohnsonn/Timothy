const { loadCommands } = require("../../Handlers/commandHandler");

module.exports = {
  name: "threadCreate",
  execute(thread, newlyCreated) {
    if (newlyCreated === true) {
      if (
        thread.parentId === "1046864664203636908" /*||
        thread.parentId === "1046572462097322035"*/
      ) {
        // if it is in bug-reports forum channel
        var appliedTags = thread.appliedTags;
        appliedTags.push("1046872466036883528");
        thread.setAppliedTags(appliedTags);
      }
    }
  },
};
