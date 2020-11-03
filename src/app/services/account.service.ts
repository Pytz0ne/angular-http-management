




import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Permission, PermissionNames, PermissionValues } from '../models/permission.model';
import { UserEdit } from '../models/user-edit.model';
import { WebapiService } from '@Project/services/webapi-service';
import { EndpointFactory } from './endpoint-factory.service';



export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };



@Injectable()
export class AccountService {

  public static readonly roleAddedOperation: RolesChangedOperation = "add";
  public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
  public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

  private _rolesChanged = new Subject<RolesChangedEventArg>();


  constructor(private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private webapi: WebapiService) {

  }

  getUser(userId: number) {
    return this.webapi.User.UserId_GET(userId);
  }

  // getUserAndRoles(userId?: string) {

  //   return forkJoin(
  //     this.getUserEndpoint<User>(userId),
  //     this.accountEndpoint.getRolesEndpoint<Role[]>());
  // }

  // getUser(page?: number, pageSize?: number) {

  //   return this.accountEndpoint.getUserEndpoint<User[]>(page, pageSize);
  // }

  // getUserAndRoles(page?: number, pageSize?: number) {

  //   return forkJoin(
  //     this.accountEndpoint.getUserEndpoint<User[]>(page, pageSize),
  //     this.accountEndpoint.getRolesEndpoint<Role[]>());
  // }


  // updateUser(user: UserEdit) {
  //   if (user.Id) {
  //     return this.accountEndpoint.getUpdateUserEndpoint(user, user.Id);
  //   }
  //   else {
  //     return
  //     this.webapi.User.UserId_GET
  //     this.accountEndpoint.getUserByUserNameEndpoint<User>(user.userName).pipe<User>(
  //       mergeMap(foundUser => {
  //         user.Id = foundUser.Id;
  //         return this.accountEndpoint.getUpdateUserEndpoint(user, user.Id)
  //       }));
  //   }
  // }


  // newUser(user: UserEdit) {
  //   return this.accountEndpoint.getNewUserEndpoint<User>(user);
  // }


  // getUserPreferences() {
  //   return this.accountEndpoint.getUserPreferencesEndpoint<string>();
  // }

  // updateUserPreferences(configuration: string) {
  //   return this.accountEndpoint.getUpdateUserPreferencesEndpoint(configuration);
  // }


  // deleteUser(userOrUserId: string | UserEdit): Observable<User> {

  //   if (typeof userOrUserId === 'string' || userOrUserId instanceof String) {
  //     return this.accountEndpoint.getDeleteUserEndpoint<User>(<string>userOrUserId).pipe<User>(
  //       tap(data => this.onRolesUserCountChanged(data.roles)));
  //   }
  //   else {

  //     if (userOrUserId.Id) {
  //       return this.deleteUser(userOrUserId.Id);
  //     }
  //     else {
  //       return this.accountEndpoint.getUserByUserNameEndpoint<User>(userOrUserId.userName).pipe<User>(
  //         mergeMap(user => this.deleteUser(user.Id)));
  //     }
  //   }
  // }


  // unblockUser(userId: string) {
  //   return this.accountEndpoint.getUnblockUserEndpoint(userId);
  // }


  userHasPermission(permissionValue: PermissionValues): boolean {
    return this.permissions.some(p => p == permissionValue);
  }


  refreshLoggedInUser() {
    return this.authService.refreshLogin();
  }




  // getRoles(page?: number, pageSize?: number) {

  //   return this.accountEndpoint.getRolesEndpoint<Role[]>(page, pageSize);
  // }


  // getRolesAndPermissions(page?: number, pageSize?: number) {

  //   return forkJoin(
  //     this.accountEndpoint.getRolesEndpoint<Role[]>(page, pageSize),
  //     this.accountEndpoint.getPermissionsEndpoint<Permission[]>());
  // }


  // updateRole(role: Role) {
  //   if (role.Id) {
  //     return this.accountEndpoint.getUpdateRoleEndpoint(role, role.Id).pipe(
  //       tap(data => this.onRolesChanged([role], AccountService.roleModifiedOperation)));
  //   }
  //   else {
  //     return this.accountEndpoint.getRoleByRoleNameEndpoint<Role>(role.name).pipe(
  //       mergeMap(foundRole => {
  //         role.Id = foundRole.Id;
  //         return this.accountEndpoint.getUpdateRoleEndpoint(role, role.Id)
  //       }),
  //       tap(data => this.onRolesChanged([role], AccountService.roleModifiedOperation)));
  //   }
  // }


  // newRole(role: Role) {
  //   return this.accountEndpoint.getNewRoleEndpoint<Role>(role).pipe<Role>(
  //     tap(data => this.onRolesChanged([role], AccountService.roleAddedOperation)));
  // }


  // deleteRole(roleOrRoleId: string | Role): Observable<Role> {

  //   if (typeof roleOrRoleId === 'string' || roleOrRoleId instanceof String) {
  //     return this.accountEndpoint.getDeleteRoleEndpoint<Role>(<string>roleOrRoleId).pipe<Role>(
  //       tap(data => this.onRolesChanged([data], AccountService.roleDeletedOperation)));
  //   }
  //   else {

  //     if (roleOrRoleId.Id) {
  //       return this.deleteRole(roleOrRoleId.Id);
  //     }
  //     else {
  //       return this.accountEndpoint.getRoleByRoleNameEndpoint<Role>(roleOrRoleId.name).pipe<Role>(
  //         mergeMap(role => this.deleteRole(role.Id)));
  //     }
  //   }
  // }

  // getPermissions() {

  //   return this.accountEndpoint.getPermissionsEndpoint<Permission[]>();
  // }


  private onRolesChanged(roles: Role[] | string[], op: RolesChangedOperation) {
    this._rolesChanged.next({ roles: roles, operation: op });
  }


  onRolesUserCountChanged(roles: Role[] | string[]) {
    return this.onRolesChanged(roles, AccountService.roleModifiedOperation);
  }


  getRolesChangedEvent(): Observable<RolesChangedEventArg> {
    return this._rolesChanged.asObservable();
  }



  get permissions(): PermissionValues[] {
    return this.authService.userPermissions;
  }

  get currentUser() {
    return this.authService.currentUser;
  }
}
