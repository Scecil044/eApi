import { set } from "mongoose";
import Rating from "../models/Rating.model.js";
import { createComment } from "./comment.service.js";

export const createNewProductrating = async (reqBody) => {
  try {
    const ratings = await Rating.find({ isDeleted: false });
    const userIds = ratings.map((item) => item.userId);
    const userIdSet = new set(userIds);

    if (userIdSet.has(req.user.id)) {
      throw new Error("You cannot rate more than once for this item");
    }

    const newRating = new Rating({
      userId: req.user.id,
      productId,
      category: "product",
      rating: reqBody.rating,
    });
    await createComment(reqBody.comment);

    await newRating.save();
    return newRating;
  } catch (error) {
    console.log(error);
    throw new Error("cant rate product");
  }
};

export const createNewBusinessRating = async () => {};
