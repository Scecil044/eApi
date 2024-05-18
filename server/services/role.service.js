import Role from "../models/Role.model.js";

export const addRole = async (reqBody) => {
  try {
    const isRole = await Role.findOne({
      roleId: reqBody.roleId,
      isDeleted: { $ne: true },
    });
    if (isRole) throw new Error("Role already exists!");
    const newRole = await Role.create({
      roleName: reqBody.roleName.toLowerCase(),
      roleId: reqBody.roleId,
      // createdBy: req.user.id,
    });
    return newRole;
  } catch (error) {
    console.log(error);
    throw new Error("An error was encountered when adding role", error);
  }
};
export const findRoleByName = async (roleName) => {
  try {
    const isRole = await Role.findOne({ roleName: roleName });
    if (!isRole) throw new Error("No role with matching name exists");
    return isRole;
  } catch (error) {
    console.log(error);
    throw new Error("could not find role by name");
  }
};
export const findRoleByRoleId = async (roleID) => {
  try {
    const role = await Role.findOne({ roleId: roleID });
    if (!role) throw new Error("Role not found ");
    return role;
  } catch (error) {
    throw new Error("could not find role by provided roleId");
  }
};
// function to list all roles in the database
export const findRoles = async () => {
  try {
    const roles = await Role.find({ isDeleted: false });
    if (roles.length < 1) throw new Error("No roles have been registered yet!");
    return roles;
  } catch (error) {
    throw new Error("could not find roles!", error);
  }
};
export const modifyRole = async (roleId, roleName) => {
  try {
    // console.log(roleId, roleName);
    const result = await Role.findByIdAndUpdate(
      roleId,
      {
        $set: { roleName: roleName, updatedBy: req.user.id },
      },
      { new: true }
    );
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("failed to delete record", error);
  }
};
export const removeRole = async (roleId, userDetails) => {
  try {
    return await Role.findByIdAndUpdate(
      roleId,
      { $set: { isDeleted: true, deletedBy: userDetails.id } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    throw new Error("failed to delete record", error);
  }
};
export const findRole = async (id) => {};
