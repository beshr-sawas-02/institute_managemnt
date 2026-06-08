"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformRoles = exports.PLATFORM_ROLES_KEY = exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
exports.PLATFORM_ROLES_KEY = 'platform_roles';
const PlatformRoles = (...roles) => (0, common_1.SetMetadata)(exports.PLATFORM_ROLES_KEY, roles);
exports.PlatformRoles = PlatformRoles;
//# sourceMappingURL=roles.decorator.js.map