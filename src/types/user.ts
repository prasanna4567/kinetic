import { Account, Invitation } from "@graphql/types";

import { Group } from "./group";

export type User = Pick<Account, "_id"| "name" | "primaryEmailAddress"> & {
  group?: Group
}

export type PendingInvitation = Pick<Invitation, "_id" | "email"> & {
  group?: Group | null
  invitedBy?: User | null
}
