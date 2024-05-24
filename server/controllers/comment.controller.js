import { deleteCommentById, editComment } from "../services/comment.service.js";
import { errorHandler } from "../utils/error.js";

export const deleteUserComment = async (req, res, next) => {
  try {
    const response = await deleteCommentById(req.params.commentId);
    if (!response)
      return next(errorHandler(400, "could not mark comment as deleted!"));

    res.status(200).json("comment deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const result = await editComment(req.params.commentId);
  } catch (error) {
    next(error);
  }
};
