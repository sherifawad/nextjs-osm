"use server";

import { getUser, getUsers, getUsersCount, updateUserDb } from "@/data-access";
import {
  GetUserPlaces,
  GetUsers,
  RoleType,
  SortingType,
  User,
  UserPlaces,
  UserPlacesType,
} from "@/types";
import { revalidatePath } from "next/cache";

export const getUsersResult = async ({
  userId,
  search,
  page,
  size,
  role,
  column,
  sort,
  filter,
}: {
  userId: string;
  search: string;
  page: number;
  size: number;
  role?: RoleType;
  column: keyof User;
  filter?: keyof User;
  sort: SortingType;
}) => {
  let inputData: GetUsers = {
    id: userId,
    columnToSort: column,
    sorting: sort,
    columnToFilter: filter,
    search,
    role,
  };

  const start = (Number(page) - 1) * Number(size); // 0, 5, 10 ...
  // const end = start + Number(size); // 5, 10, 15 ...
  const countResult = await getUsersCount(inputData);
  if (countResult.status === "success") {
    inputData = { ...inputData, skip: start, take: size };
    const placesResult = await getUsers(inputData);
    if (placesResult.status === "success") {
      return { data: placesResult.data, count: countResult.data };
    }
  }
  return { data: [], count: 0 };
};

export const updateUserReputation = async ({
  loggedUserId,
  userId,
  changeType,
}: {
  loggedUserId: string;
  userId: string;
  changeType: "increment" | "decrement";
}) => {
  try {
    const loggedUser = await getUser({ id: loggedUserId });
    if (loggedUser.status === "error") return;
    if (loggedUser.data.role === "USER") return;
    const userToUpdate = await getUser({ id: userId });
    if (userToUpdate.status === "error") return;
    if (
      (loggedUser.data.role === "ADMIN" || loggedUser.data.role === "OWNER") &&
      userToUpdate.data.role !== "USER"
    ) {
      return;
    }
    if (changeType === "increment" && userToUpdate.data.userReputation === 7)
      return;
    if (changeType === "decrement" && userToUpdate.data.userReputation === 0)
      return;
    const result = await updateUserDb({
      id: userId,
      userReputation:
        changeType === "increment"
          ? userToUpdate.data.userReputation + 1
          : userToUpdate.data.userReputation - 1,
    });
    if (result.status === "success") {
      revalidatePath(`/dashboard/${loggedUserId}/users`);
    }
  } catch (error) {}
};
export const updateUserRole = async ({
  loggedUserId,
  userId,
  newRole,
}: {
  loggedUserId: string;
  userId: string;
  newRole: RoleType;
}) => {
  try {
    const loggedUser = await getUser({ id: loggedUserId });
    if (loggedUser.status === "error") return;
    if (loggedUser.data.role === "USER") return;
    const userToUpdate = await getUser({ id: userId });
    if (userToUpdate.status === "error") return;
    if (loggedUser.data.role === "ADMIN" && userToUpdate.data.role !== "USER") {
      return;
    }
    const result = await updateUserDb({
      id: userId,
      role: newRole,
    });
    if (result.status === "success") {
      revalidatePath(`/dashboard/${loggedUserId}/users`);
    }
  } catch (error) {}
};
