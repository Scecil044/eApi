import Role from "../models/Role.model.js";

export const addRole = async (roleName) => {
  try {
    const isRole = await Role.find({ roleName: roleName.toLowerCase() });
    if (isRole) {
      throw new Error("Role already exists!");
    }
    const newRole = await Role.create({
      roleName: roleName.toLowerCase(),
      // createdBy: req.user.id,
    });
    return newRole;
  } catch (error) {
    console.log(error);
    throw new Error("An error was encountered when adding role", error);
  }
};
export const findRoleByRoleId = async (roleID) => {
  try {
    const role = await Role.find({ roleId: roleID });
    if (!role) throw new Error("Role not found ");
    return role;
  } catch (error) {
    throw new Error("could not find role by provided roleId");
  }
};
export const findRoles = async () => {
  try {
    const roles = await Role.find();
    if (roles.length < 1) throw new Error("No roles have been registered yet!");
    return roles;
  } catch (error) {
    throw new Error("could not find roles!", error);
  }
};
export const modifyRole = async (roleId, reqBody) => {
  try {
    const result = await Role.findByIdAndUpdate(roleId, {
      $set: { roleName: true },
    });
    return result;
  } catch (error) {
    throw new Error("failed to delete record", error);
  }
};
export const removeRole = async (roleId) => {
  try {
    return await Role.findByIdAndUpdate(roleId, { $set: { isDeleted: true } });
  } catch (error) {
    throw new Error("failed to delete record", error);
  }
};
export const findRole = async (id) => {};
