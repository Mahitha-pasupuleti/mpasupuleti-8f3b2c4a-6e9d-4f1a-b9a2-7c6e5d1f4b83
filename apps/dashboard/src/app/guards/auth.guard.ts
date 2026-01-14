import { CanActivateFn } from '@angular/router';

export const AuthGuard: CanActivateFn = () => {
  const token = localStorage.getItem('token');
  console.log(token)
  return !!token; // allow if token exists
};
