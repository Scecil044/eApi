import Role from "../models/Role.model.js";
import {
  addRole,
  findRoles,
  modifyRole,
  removeRole,
} from "../services/role.service.js";
import { errorHandler } from "../utils/error.js";

/*
 *Function to create role
 */
export const createRole = async (req, res, next) => {
  try {
    const { roleName } = req.body;
    if (!roleName) return next(errorHandler(400, "provide the tole name"));
    const createdRole = await addRole(roleName);
    res.status(200).json(createdRole);
  } catch (error) {
    next(error);
  }
};
/*
 *Function to list roles
 */
export const getRoles = async (req, res, next) => {
  try {
    const roles = await findRoles();
    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};
/*
 *Function to update role
 */
export const updateRole = async (req, res, next) => {
  try {
    const { roleName } = req.body;
    if (roleName) return next(errorHandler(400, "provide a role name"));
    const updatedRole = await modifyRole(req.params.id, roleName);
    res.status(200).json(updatedRole);
  } catch (error) {
    next(error);
  }
};

/*
 *Function to delete role
 */
export const deleteRole = async (req, res, next) => {
  try {
    const isRole = await Role.findById(req.params.id);
    if (!isRole) return next(errorHandler(404, "role not found!"));
    const deleteRole = await removeRole(req.params.id);
    res.status(200).json("role deleted");
  } catch (error) {
    next(error);
  }
};
