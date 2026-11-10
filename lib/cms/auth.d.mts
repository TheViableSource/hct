export const COOKIE:string;
export const PREVIEW_COOKIE:string;
export const SESSION_SECONDS:number;
export function cmsOrigin():string;
export function cookieOptions():{httpOnly:true;secure:boolean;sameSite:'strict';path:string;maxAge:number};
export function checkOrigin(request:Request):void;
export function createUser(username:string,password:string,options?:object):Promise<void>;
export function login(username:string,password:string,options?:object):Promise<string>;
export function sessionUser(token?:string,options?:object):string|null;
export function logout(token?:string,options?:object):void;

export function createInvitation(username:string,options?:object):string;
export function activateInvitation(token:string,password:string,options?:object):Promise<string>;
