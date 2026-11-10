import type { ContentDocument } from './types';
export class CmsError extends Error {status:number; constructor(status:number,message:string);}
export const PAGES:string[];
export function safeUrl(value:string):string;
export function validateDocument(input:unknown, defaults:ContentDocument):ContentDocument;
