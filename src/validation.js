export class NumericError extends Error{constructor(code,message){super(message);this.name='NumericError';this.code=code;}}
export function requireThat(condition,message,code='INPUT'){if(!condition)throw new NumericError(code,message);}
export function finite(value,label='Value'){requireThat(typeof value==='number'&&Number.isFinite(value),label+' must be finite');return value;}
export function integer(value,label,min=1,max=100000){requireThat(Number.isInteger(value)&&value>=min&&value<=max,label+' must be an integer in '+min+'..'+max);return value;}
export function vector(value,label='Vector',{max=256}={}){requireThat((Array.isArray(value)||ArrayBuffer.isView(value))&&value.length>0&&value.length<=max,label+' has invalid length');return Array.from(value,v=>finite(v,label));}
export function matrix(value,label='Matrix'){requireThat(Array.isArray(value)&&value.length>0&&value.length<=256,label+' has invalid rows');const rows=value.map(row=>vector(row,label));requireThat(rows.every(row=>row.length===rows[0].length),label+' must be rectangular');return rows;}
export function same(a,b){requireThat(a.length===b.length,'Vector dimensions differ');}
export function options(value,allowed){requireThat(value&&typeof value==='object'&&!Array.isArray(value),'Options must be an object');for(const key of Object.keys(value))requireThat(allowed.includes(key),'Unknown option '+key);return value;}
