import Comment from "../models/Comment.model.js";

export const createComment = async (commentBody) => {
  try {
    const newComment = await Comment.create({
      userId: req.user.id,
      text: commentBody.comment,
    });
    return newComment;
  } catch (error) {
    console.log(error);
    throw new Error("could not add comment to product rating");
  }
};

export const findCommentById = async (productId) => {
  try {
    const userComment = await Comment.find({
      isDeleted: false,
      userId: req.user.id,
      productId: productId,
    });
    return userComment;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteCommentById = async (commentId) => {
  try {
    const specificComment = await findCommentById(commentId);
    if (specificComment) {
      throw new Error("No comment with sepcified id was found");
    }
    return await Comment.findByIdAndUpdate(
      specificComment._id,
      {
        $set: {
          isDeleted: true,
        },
      },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    throw new Error("unable to delete comment");
  }
};

export const editComment = async (commentId) => {
  try {
    const specificComment = await findCommentById(commentId);
    if (specificComment) {
      throw new Error("No comment with sepcified id was found");
    }
    const result = await Comment.findByIdAndUpdate(
      specificComment._id,
      {
        $set: {
          isDeleted: true,
        },
      },
      { new: true }
    );
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("unable to edit comment");
  }
};
