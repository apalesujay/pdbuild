"use Strit";

exports.handle = function(req, res, err, guid) {

  switch (err.name) {
    case "ValidationError":
      return res.status(409).send({ info: err.message, error: err });

    case "MongoError":
      if (err.code === 11000) {
        return res.status(409).send({ info: err.message, error: err });
      } else {
        return res.status(500).send(err);
      }

    default:
      return res.status(500).send(err);
  }
  
};
