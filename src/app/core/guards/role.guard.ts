import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SessionService } from '@core/services/session.servies';
import { Role } from '@core/interfaces/role.interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private session: SessionService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const allowedRoles = route.data['roles'] as Role[];

    const user = await firstValueFrom(this.session.user$);
    const roleId = user?.role_id ?? Role.Guest; // fallback to guest (0)

    if (!allowedRoles.includes(roleId)) {
      await this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
