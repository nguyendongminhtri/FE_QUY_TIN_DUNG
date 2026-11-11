import {CanActivateFn, Router} from '@angular/router';
import {TokenService} from "../../service/token.service";
import {inject} from "@angular/core";

export const adminGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const roles: any[] = tokenService.getRole() || [];
  console.log('roles -->', roles);
  const isAdmin = roles.some(r => (r?.authority ?? r) === 'ADMIN');
  console.log('isAdmin -->', isAdmin);
  return isAdmin ? true : router.createUrlTree(['/']);
};
