const UserModel = require('../models/user.model');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (request, response) => {
  const users = await UserModel.find().select('-password');
  response.status(200).json(users);
}

module.exports.getUser = (request, response) => {
  if (!ObjectId.isValid(request.params.id)) {
    return response.status(400).send('ID unknown : ' + request.params.id)
  }
  UserModel.findById(request.params.id, (err, docs) => {
    if (!err) {
      response.send(docs);
    } else {
      console.log('Id unknown : ' + err);
    }
  }).select('-password');
}

module.exports.updateUser = async (request, response) => {
  if (!ObjectId.isValid(request.params.id)) {
    return response.status(400).send('ID unknown : ' + request.params.id)
  }
  try {
    await UserModel.findOneAndUpdate(
      {_id: request.params.id},
      {
        $set: {
          bio: request.body.bio,
        }
      },
      {new: true, upsert: true, setDefaultsOnInsert: true},
      (err, docs) => {
        if (!err) {
          return response.send(docs);
        } else {
          return response.status(500).send({message: err});
        }
      }
    )
  } catch (err) {
    return response.status(500).json({message: err});
  }
}

module.exports.deleteUser = async (request, response) => {
  if (!ObjectId.isValid(request.params.id)) {
    return response.status(400).send('ID unknown : ' + request.params.id)
  }
  try {
    await UserModel.remove({_id: request.params.id}).exec();
    response.status(200).json({message: "Successfully deleted."})
  } catch (err) {
    return response.status(500).json({message: err});
  }
}

module.exports.follow = async (request, response) => {
  if (!ObjectId.isValid(request.params.id)) {
    return response.status(400).send('ID unknown : ' + request.params.id)
  }
  if (!ObjectId.isValid(request.body.idToFollow)) {
    return response.status(400).send('ID unknown : ' + request.body.idToFollow)
  }
  try {
    // Add to the follower list
    await UserModel.findByIdAndUpdate(
      request.params.id,
      {$addToSet: {following: request.body.idToFollow}},
      {new: true, upsert: true},
      (err, docs) => {
        if (!err) {
          response.status(201).json(docs);
        } else {
          return response.status(400).json({message: err});
        }
      }
    );
    // Add to following list
    await UserModel.findByIdAndUpdate(
      request.body.idToFollow,
      {$addToSet: {followers: request.params.id}},
      {new: true, upsert: true},
      (err) => {
        if (err){
          return response.status(400).json({message: err});
        }
      }
    );
  } catch (err) {
    return response.status(500).json({message: err});
  }
}

module.exports.unfollow = async (request, response) => {
  if (!ObjectId.isValid(request.params.id)) {
    return response.status(400).send('ID unknown : ' + request.params.id)
  }
  if (!ObjectId.isValid(request.body.idToUnfollow)) {
    return response.status(400).send('ID unknown : ' + request.body.idToUnfollow)
  }
  try {
    // Add to the follower list
    await UserModel.findByIdAndUpdate(
      request.params.id,
      {$pull: {following: request.body.idToUnfollow}},
      {new: true, upsert: true},
      (err, docs) => {
        if (!err) {
          response.status(201).json(docs);
        } else {
          return response.status(400).json({message: err});
        }
      }
    );
    // Add to following list
    await UserModel.findByIdAndUpdate(
      request.body.idToFollow,
      {$pull: {followers: request.params.id}},
      {new: true, upsert: true},
      (err) => {
        if (err){
          return response.status(400).json({message: err});
        }
      }
    );
  } catch (err) {
    return response.status(500).json({message: err});
  }
}