// Requiring ObjectId from mongoose npm package
const ObjectId = require("mongoose").Types.ObjectId;

module.exports =
  // Validator function
  function isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
      if (String(new ObjectId(id)) === id) return true;
      return false;
    }
    return false;
  };
