import { UUID } from "crypto";

export type RolePermission = {
    role_id: UUID;
    permission_id: UUID;
};
