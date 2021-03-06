const mongoCollections = require("../config/mongoCollection");
const books = mongoCollections.books;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");

const updateRating = (checkBook, rating) => {
  rating = parseInt(rating);
  let avgRating = rating;
  checkBook.reviews.forEach((element) => {
    avgRating += element.rating;
  });
};

async function createReview(
  bookId,
  userId,
  rating,
  dateOfReview,
  comment,
  username
) {
  const userCollection = await users();
  const userData = await userCollection.findOne({ _id: ObjectId(userId) });

  if (userData === null) throw "User does not exist";

  const bookCollection = await books();
  const checkBook = await bookCollection.findOne({
    _id: ObjectId(bookId),
  });

  if (checkBook === null) throw "Book does not exist";

  const averageRating = updateRating(checkBook, rating);

  const newReview = {
    _id: new ObjectId(),
    bookId: bookId,
    userId: userId,
    rating: rating,
    dateOfReview: dateOfReview,
    comment: comment,
    username: username,
  };

  const ratingUpdate = await bookCollection.updateOne(
    { _id: ObjectId(bookId) },
    {
      $set: { averageRating: averageRating },
      $push: { reviews: newReview },
    }
  );

  if (!ratingUpdate.matchedCount && !ratingUpdate.modifiedCount)
    throw "Creating reviews have been failed";

  const userUpdate = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $push: { reviews: newReview } }
  );

  if (!userUpdate.matchedCount && !userUpdate.modifiedCount)
    throw "Cannot add Reviews to the User collection";

  const sameReview = await bookCollection.findOne({
    _id: ObjectId(bookId),
  });

  if (sameReview === null)
    throw "Book does not exist, review cannot be displayed";

  return sameReview;
}

async function getReview(reviewId) {
  let resultData = {};
  const bookCollection = await books();
  const book = await bookCollection.find({}).toArray();

  if (book === null) throw "No review present with that ID";

  book.forEach((element) => {
    element.reviews.forEach((data) => {
      if (data._id.toString() === reviewId.toString()) {
        resultData = {
          _id: data._id,
          bookId: data.bookId,
          userId: data.userId,
          rating: data.rating,
          dateOfReview: data.dateOfReview,
          comment: data.comment,
          username: data.username,
        };
      }
    });
  });
  return resultData;
}

async function getAllReviewsOfBook(bookId) {
  const bookCollection = await books();
  const book = await bookCollection.findOne({
    _id: ObjectId(bookId),
  });

  if (book === null) throw "No book found with that ID";
  return book.reviews;
}

async function getAllReviewsOfUser(userId) {
  let resultData = {};
  const bookCollection = await books();
  const book = await bookCollection.find({}).toArray();

  if (book === null) throw "No review present with that ID";

  book.forEach((element) => {
    element.reviews.forEach((data) => {
      if (data.userId.toString() === userId.toString()) {
        resultData = {
          _id: data._id,
          bookId: data.bookId,
          userId: data.userId,
          rating: data.rating,
          dateOfReview: data.dateOfReview,
          comment: data.comment,
          username: data.username,
        };
      }
    });
  });
  return resultData;
}

async function removeReview(reviewId) {
  let avgRating = 0;
  let resultData = {};
  const bookCollection = await books();
  const book = await bookCollection
    .aggregate([
      { $unwind: "$reviews" },
      { $match: { "reviews._id": ObjectId(reviewId) } },
      { $replaceRoot: { newRoot: "$reviews" } },
    ])
    .toArray();

  if (book === null) throw "No review present with that Id";

  const removeReview = await bookCollection.updateOne(
    {},
    { $pull: { reviews: { _id: ObjectId(reviewId) } } }
  );

  if (!removeReview.matchedCount && !removeReview.modifiedCount)
    throw "Removal of review has failed";

  const getBookData = await bookCollection.findOne({
    _id: ObjectId(book[0].bookId),
  });

  if (getBookData === null) throw "No book found with that ID";

  getBookData.reviews.forEach((element) => {
    avgRating += element.rating;
  });

  if (getBookData.bookReviews.length !== 0) {
    avgRating = Number(avgRating / getBookData.reviews.length).toFixed(1);
  } else {
    avgRating = 0;
  }

  const reviewUpdate = await bookCollection.updateOne(
    { _id: ObjectId(book[0].bookId) },
    { $set: { averageRating: avgRating } }
  );

  if (!reviewUpdate.matchedCount && !reviewUpdate.modifiedCount)
    throw "Update of the rating has been failed";

  const userCollection = await users();
  const removeUserReview = await userCollection.updateOne(
    {},
    { $pull: { reviews: { _id: ObjectId(reviewId) } } }
  );

  if (!removeUserReview.matchedCount && !removeUserReview.modifiedCount)
    throw "Removal of review from the user has failed";

  resultData = {
    reviewId: reviewId,
    deleted: true,
    bookId: book[0].bookId,
  };
  return resultData;
}

async function updateReview(reviewId, rating, comment) {
  //   if (!errorCheck.checkId(reviewId)) throw "Review Id is not a valid input";
  //   if (!errorCheck.checkRating(rating)) throw "Rating is not a valid input";
  //   if (!errorCheck.checkString(comment)) throw "Comment is not a valid input";

  rating = parseInt(rating);
  const userCollection = await users();
  const bookCollection = await books();
  const findReview = await bookCollection
    .aggregate([
      { $unwind: "$reviews" },
      { $match: { "reviews._id": ObjectId(reviewId) } },
      { $replaceRoot: { newRoot: "$reviews" } },
    ])
    .toArray();

  if (findReview === null) throw "Review does not exist";

  const extractReview = await bookCollection.updateOne(
    {},
    { $pull: { reviews: { _id: ObjectId(reviewId) } } }
  );

  if (!extractReview.matchedCount && !extractReview.modifiedCount)
    throw "Review update has been failed";

  const getBookData = await bookCollection.findOne({
    _id: ObjectId(findReview[0].bookId),
  });

  if (getBookData === null) throw "No book found with that ID";

  let avgRating = rating;
  getBookData.reviews.forEach((element) => {
    avgRating += element.rating;
  });

  if (getBookData.reviews.length !== 0) {
    avgRating = Number(avgRating / (getBookData.reviews.length + 1)).toFixed(1);
  } else {
    avgRating = rating;
  }

  const newReviewInfo = {
    _id: findReview[0]._id,
    bookId: findReview[0].bookId,
    userId: findReview[0].userId,
    rating: rating,
    dateOfReview: findReview[0].dateOfReview,
    comment: comment,
    username: findReview[0].username,
  };

  const updateReview = await bookCollection.updateOne(
    { _id: ObjectId(findReview[0].bookId) },
    {
      $set: { averageRating: avgRating },
      $push: { reviews: newReviewInfo },
    }
  );

  if (!updateReview.matchedCount && !updateReview.modifiedCount)
    throw "Update has been failed";

  if (!updateReview.modifiedCount)
    throw "Same values has been provided for update. Please change the values";

  const extractUserReview = await userCollection.updateOne(
    {},
    { $pull: { reviews: { _id: ObjectId(reviewId) } } }
  );

  if (!extractUserReview.matchedCount && !extractUserReview.modifiedCount)
    throw "Review remove from the user have been failed";

  const updateNewReview = await userCollection.updateOne(
    { _id: ObjectId(findReview[0].userId) },
    { $push: { reviews: newReviewInfo } }
  );

  if (!updateNewReview.matchedCount && !updateNewReview.modifiedCount)
    throw "Update has been failed in the user collection";

  return await this.getReview(reviewId);
}

module.exports = {
  createReview,
  getReview,
  getAllReviewsOfBook,
  getAllReviewsOfUser,
  removeReview,
  updateReview,
};
