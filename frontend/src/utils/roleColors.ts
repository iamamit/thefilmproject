import { UserRole } from '../types/enums';

export const roleColors: Record<UserRole, string> = {
  DIRECTOR: '#0a66c2',
  EDITOR: '#0073b1',
  MUSICIAN: '#9b59b6',
  PRODUCER: '#f39c12',
  ACTOR: '#1abc9c',
  CINEMATOGRAPHER: '#e67e22',
  VFX_ARTIST: '#3498db',
  WRITER: '#2ecc71',
};

export function getPrimaryRoleColor(roles: UserRole[]): string {
  return roles.length > 0 ? (roleColors[roles[0]] ?? '#0a66c2') : '#0a66c2';
}
