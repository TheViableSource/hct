/** One-time source registration/adapter. --write converts unchanged legacy JSX.
 * Content IDs are hashes of original displayed copy. --prune removes unused entries. */
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const write=process.argv.includes('--write');
const prune=process.argv.includes('--prune');
const seen={text:new Set(),links:new Set()};
let owner='';
const pages=['/','/about','/community','/donate','/get-involved'];
const defaultsPath='lib/cms/defaults.json';
const document=fs.existsSync(defaultsPath)?JSON.parse(fs.readFileSync(defaultsPath,'utf8')):{version:1,text:{},links:{},sections:Object.fromEntries(pages.map(p=>[p,[]])),posts:[],seo:{}};
const fields=fs.existsSync('lib/cms/fields.json')?JSON.parse(fs.readFileSync('lib/cms/fields.json','utf8')):{};
const decode=value=>value.replace(/&ldquo;/g,"“").replace(/&rdquo;/g,"”").replace(/&apos;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&nbsp;/g,'\u00a0').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)));
const normalized=value=>decode(value).replace(/\s+/g,' ').trim();
const groups = {
 'about/FoundingStory':'About: Story', 'about/MissionVisionValues':'About: Mission and values', 'about/Timeline':'About: Roadmap',
 'community/CommunityValues':'Community: Values', 'community/EmotionalStatement':'Community: Our people', 'community/RoleCards':'Community: Roles',
 'donate/DonationTiers':'Donate: Giving levels', 'donate/OtherWays':'Donate: Other ways to give', 'donate/WhyItMatters':'Donate: Impact',
 'get-involved/Auditions':'Get involved: Auditions', 'get-involved/FoundersNote':'Get involved: Founders note', 'get-involved/Sponsorship':'Get involved: Sponsorship', 'get-involved/Volunteer':'Get involved: Volunteering',
 'home/Hero':'Home: Hero', 'home/Vision':'Home: Vision', 'home/Pillars':'Home: Promises', 'home/CommunityCall':'Home: Community', 'home/StayConnected':'Home: Newsletter',
 'layout/Nav':'Shared: Navigation', 'layout/Footer':'Shared: Footer', 'layout/PageHero':'Shared: Page headings', 'shared/CTASection':'Shared: Calls to action',
 'forms/CommunityForm':'Forms: Community', 'forms/MasterForm':'Forms: Get involved', 'forms/NewsletterForm':'Forms: Newsletter', 'forms/DonateForm':'Forms: Giving notice', 'forms/fields':'Forms: Shared labels and messages', 'forms/Options':'Forms: Choices',
 'page':'Home: Page', 'about':'About: Page', 'community':'Community: Page', 'donate':'Donate: Page', 'get-involved':'Get involved: Page', 'blog':'News: Listing', 'blog/[slug]':'News: Story',
 'ui/ScrollIndicator':'Shared: Scroll hint', 'ui/Button':'Shared: Buttons', 'ui/SectionLabel':'Shared: Section labels', 'ui/AtmosphericCard':'Shared: Cards', 'ui/SectionReveal':'Shared: Sections',
};
const constantGroups={BRAND:'Shared: Brand and contact',NAV_LINKS:'Shared: Navigation',PILLARS:'Home: Promises',COMMUNITY_ROLES:'Community: Roles',COMMUNITY_VALUES:'Community: Values',MISSION_VALUES:'About: Mission and values',MILESTONES:'About: Roadmap',DONATION_TIERS:'Donate: Giving levels',SPONSOR_TIERS:'Get involved: Sponsorship',VOLUNTEER_NEEDS:'Get involved: Volunteering'};
function register(value,kind,file){value=normalized(value);if(!value || value==='▾')return;const id=kind+'_'+createHash('sha256').update(value).digest('hex').slice(0,16);const first=!seen[kind].has(id);seen[kind].add(id);document[kind][id]??=value;
 const source=file.replace(/\.tsx?$/,'').replace(/^components\/sections\//,'').replace(/^components\//,'').replace(/^app\//,'').replace(/\/page$/,'');
 if(first) fields[id]={group:constantGroups[owner]??groups[source]??'Shared: Website copy',label:value.slice(0,85)};
}
function containingName(node){for(let current=node;current;current=current.parent)if(ts.isVariableDeclaration(current))return current.name.getText();return '';}
function isDisplayExpression(node){const p=node.parent;if(!p)return false;if(ts.isJsxExpression(p))return ts.isJsxElement(p.parent)||ts.isJsxFragment(p.parent);if(ts.isConditionalExpression(p)&&(p.whenTrue===node||p.whenFalse===node))return isDisplayExpression(p);if(ts.isBinaryExpression(p)&&p.right===node)return isDisplayExpression(p);return false;}
function inMetadata(node){for(let current=node;current;current=current.parent){if(ts.isVariableDeclaration(current)&&current.name.getText()==='metadata')return true;if(ts.isFunctionDeclaration(current)&&current.name?.text==='generateMetadata')return true;}return false;}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=[...walk('components/sections'),...walk('components/layout'),...walk('components/ui'),...walk('components/forms').filter(f=>f.endsWith('.tsx')&&!f.endsWith('ConsentFields.tsx')),...pages.map(p=>'app'+(p==='/'?'':p)+'/page.tsx'),'lib/constants.ts','app/blog/page.tsx','app/blog/[slug]/page.tsx'].filter(f=>/\.tsx?$/.test(f));
const visibleProps=new Set(['label','title','subtitle','caption','heading','body','name','short','wordmark','tagline','mission','location','email','phase','amount','cta','featuredLabel','tier','investment','recognition','message','placeholder']);
for(const file of files){let source=fs.readFileSync(file,'utf8');const sf=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const changes=[];let needsText=false,needsLink=false;
function visit(node){
 owner=containingName(node);
 if(ts.isJsxText(node)&&normalized(node.text)){
  register(node.text,'text',file);
  const parent=node.parent;const tag=ts.isJsxElement(parent)?parent.openingElement.tagName.getText(sf):'';
  if(tag!=='ContentText'){changes.push({start:node.pos,end:node.end,value:'<ContentText>'+source.slice(node.pos,node.end)+'</ContentText>'});needsText=true;}
 }
 if(ts.isJsxExpression(node)&&node.expression&&(ts.isJsxElement(node.parent)||ts.isJsxFragment(node.parent))){
  const e=node.expression;const parent=node.parent;const tag=ts.isJsxElement(parent)?parent.openingElement.tagName.getText(sf):'';
  if(tag!=='ContentText'&&(ts.isIdentifier(e)||ts.isPropertyAccessExpression(e)||ts.isStringLiteral(e)||(ts.isConditionalExpression(e)&&ts.isStringLiteral(e.whenTrue)&&ts.isStringLiteral(e.whenFalse))||(ts.isBinaryExpression(e)&&ts.isStringLiteral(e.right)))){changes.push({start:node.getStart(sf),end:node.end,value:'<ContentText>'+node.getText(sf)+'</ContentText>'});needsText=true;}
 }
 if(ts.isStringLiteral(node)){
  const p=node.parent;
  if(ts.isJsxAttribute(p)&&visibleProps.has(p.name.getText(sf))&&p.name.getText(sf)!=='name')register(node.text,'text',file);
  if(ts.isPropertyAssignment(p)&&visibleProps.has(p.name.getText(sf))&&!inMetadata(node))register(node.text,'text',file);
  if(file==='lib/constants.ts'&&ts.isArrayLiteralExpression(p))register(node.text,'text',file);
  if((ts.isJsxAttribute(p)&&p.name.getText(sf)==='href')||(ts.isPropertyAssignment(p)&&['href','facebook','instagram'].includes(p.name.getText(sf))))register(node.text,'links',file);
  if(isDisplayExpression(node))register(node.text,'text',file);
  if(ts.isCallExpression(p)&&p.expression.getText(sf)==='translate')register(node.text,'text',file);
  if(ts.isBindingElement(p)&&p.name.getText(sf)==='message')register(node.text,'text',file);
 }
 if(ts.isJsxOpeningElement(node)||ts.isJsxClosingElement(node)||ts.isJsxSelfClosingElement(node)){if(node.tagName.getText(sf)==='a'){changes.push({start:node.tagName.getStart(sf),end:node.tagName.end,value:'CmsLink'});needsLink=true;}}
 ts.forEachChild(node,visit);
}visit(sf);
if(write&&file.endsWith('.tsx')){for(const change of changes.sort((a,b)=>b.start-a.start))source=source.slice(0,change.start)+change.value+source.slice(change.end);
source=source.replace(/import Link from "next\/link";/g,'import { CmsLink as Link } from "@/components/cms/ContentProvider";');
const names=[...(needsText?['ContentText']:[]),...(needsLink?['CmsLink']:[])].filter(name=>!Array.from(source.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']@\/components\/cms\/ContentProvider["']/g)).some(match=>match[1].split(',').map(v=>v.trim()).includes(name)));if(names.length){const imp=`\nimport { ${names.join(', ')} } from "@/components/cms/ContentProvider";\n`;if(source.startsWith('"use client";'))source=source.replace('"use client";','"use client";'+imp);else source=imp+source;}
fs.writeFileSync(file,source);
}
}
owner='';
const { INVOLVEMENT, INTENTS, SPONSOR_LEVELS } = await import('../lib/forms/schema.mjs');
for(const value of [...INVOLVEMENT,...INTENTS,...SPONSOR_LEVELS])register(value,'text','forms/Options');
register('mailto:hello@hillsborocivictheatre.com','links','layout/Footer');
if(prune){for(const kind of ['text','links'])for(const id of Object.keys(document[kind]))if(!seen[kind].has(id)){console.log('Removed:',document[kind][id]);delete document[kind][id];delete fields[id];}}
fs.mkdirSync('lib/cms',{recursive:true});fs.writeFileSync(defaultsPath,JSON.stringify(document,null,2)+'\n');fs.writeFileSync('lib/cms/fields.json',JSON.stringify(fields,null,2)+'\n');
console.log(`Registered ${Object.keys(document.text).length} text fields and ${Object.keys(document.links).length} links.`);
