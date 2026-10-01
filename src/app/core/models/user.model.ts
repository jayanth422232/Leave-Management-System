export type Role = 'EMPLOYEE' | 'MANAGER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: Role;
  department: string;
  managerId: number | null;
  active: boolean;
}