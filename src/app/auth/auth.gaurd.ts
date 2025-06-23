import { AuthService } from './auth.service';
import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const canMatchLogged: CanMatchFn = (route, segments) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  else return router.parseUrl('/');
};

export const canMatchAdmin: CanMatchFn = (route, segments) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin()) return true;
  else return router.parseUrl('/');
};
