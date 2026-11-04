export interface UserManage{
  id: number;
  name: string;
  username: string;
  email: string;
  locked: boolean;
  roles: string[];
}
