import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

/**
 * Roles Decorator
 * Used to specify which roles are allowed to access a route
 * @example @Roles(Role.ADMIN, Role.ORGANIZER)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
