export interface User {
  pid: number;
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  flows?: any[]; //TODO: Replace with actual Flow type
}
