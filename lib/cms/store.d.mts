import type { ContentDocument, ContentState } from './types';
export function readContent(options?:object):ContentState;
export function writeContent(document:ContentDocument,revision:number,actor:string,defaults:ContentDocument,options?:object):ContentState;
export function publishContent(revision:number,actor:string,defaults:ContentDocument,options?:object):ContentState;
export function openCms(options?:object):any;
export function privateDirectory(directory?:string):string;
