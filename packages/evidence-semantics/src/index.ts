import { Evidence, EvidenceComponent, Identifier, type EvidenceValue } from "@ginzaaipro/domain";

export const SEMANTIC_SCHEMA_VERSION = "semantic-schema:v1" as const;
export const SEMANTIC_RESOLVER_VERSION = "semantic-resolver:v1" as const;
export const ES_001_IDENTITY = "ES-001" as const;
export const ES_001_VERSION = "ES-001:v1" as const;
export const ES_002_IDENTITY = "ES-002" as const;
export const ES_002_VERSION = "ES-002:v1" as const;
export type SemanticReferenceKind = "EVIDENCE" | "EVIDENCE_COMPONENT";
export type SemanticResolutionStatus = "RESOLVED" | "NOT_APPLICABLE" | "UNRESOLVED";
export type SemanticDiagnosticCode = "SEMANTIC_INPUT_INVALID" | "SEMANTIC_PREDICATE_INVALID" | "SEMANTIC_RULE_NOT_FOUND" | "SEMANTIC_RULE_FAILURE" | "SEMANTIC_PROVENANCE_INCOMPLETE" | "SEMANTIC_UNRESOLVED" | "SEMANTIC_CONFLICT" | "SEMANTIC_SCHEMA_UNSUPPORTED";
export type SemanticRuleIdentity = typeof ES_001_IDENTITY | typeof ES_002_IDENTITY;
export type SemanticRuleVersion = typeof ES_001_VERSION | typeof ES_002_VERSION;
export type SemanticSchemaVersion = typeof SEMANTIC_SCHEMA_VERSION;
export type SemanticResolverVersion = typeof SEMANTIC_RESOLVER_VERSION;
export interface SemanticRule { readonly identity: SemanticRuleIdentity; readonly version: SemanticRuleVersion }
export interface SemanticPredicate { readonly namespace: string; readonly name: string }
export interface SemanticReference { readonly kind: SemanticReferenceKind; readonly identity: Identifier }
export interface SemanticProvenance { readonly evidenceReference: SemanticReference; readonly componentReference: SemanticReference; readonly projectionRule: SemanticRule; readonly referenceRule: SemanticRule; readonly semanticSchemaVersion: SemanticSchemaVersion; readonly resolverVersion: SemanticResolverVersion }
export interface SemanticFact { readonly id: Identifier; readonly predicate: SemanticPredicate; readonly value: EvidenceValue; readonly provenance: SemanticProvenance }
export interface SemanticResolutionRecord { readonly componentReference: SemanticReference; readonly status: SemanticResolutionStatus; readonly semanticFactIds: readonly Identifier[]; readonly diagnosticCodes: readonly SemanticDiagnosticCode[] }
export interface SemanticDiagnostic { readonly code: SemanticDiagnosticCode; readonly message: string; readonly evidenceId?: Identifier; readonly componentId?: Identifier; readonly ruleIdentity?: SemanticRuleIdentity }
export interface EvidenceSemantics { readonly id: Identifier; readonly evidenceReference: SemanticReference; readonly semanticSchemaVersion: SemanticSchemaVersion; readonly resolverVersion: SemanticResolverVersion; readonly facts: readonly SemanticFact[]; readonly resolutions: readonly SemanticResolutionRecord[]; readonly diagnostics: readonly SemanticDiagnostic[] }
export interface ResolveEvidenceSemanticsInput { readonly evidence: Evidence; readonly semanticSchemaVersion: string }
export type ResolveEvidenceSemanticsResult = Readonly<{ ok: true; value: EvidenceSemantics; diagnostics: readonly SemanticDiagnostic[] }> | Readonly<{ ok: false; value?: never; diagnostics: readonly SemanticDiagnostic[] }>;

const encoder = new TextEncoder();
const projectionRule: SemanticRule = Object.freeze({ identity: ES_001_IDENTITY, version: ES_001_VERSION });
const referenceRule: SemanticRule = Object.freeze({ identity: ES_002_IDENTITY, version: ES_002_VERSION });
const compareUtf8 = (left: string, right: string): number => { const a=encoder.encode(left.normalize("NFC")); const b=encoder.encode(right.normalize("NFC")); for(let i=0;i<Math.min(a.length,b.length);i+=1){const d=a[i]!-b[i]!;if(d!==0)return d} return a.length-b.length };
const compareFields = (a: readonly string[], b: readonly string[]): number => { for(let i=0;i<a.length;i+=1){const d=compareUtf8(a[i]!,b[i]!);if(d!==0)return d} return 0 };
const valueScalars = (value: EvidenceValue): readonly string[] => { switch(value.kind){case "text":case "integer":case "decimal":case "instant":return [value.kind,value.value];case "boolean":return [value.kind,String(value.value)];case "money":return [value.kind,value.minorUnits,value.currency];case "percentage":return [value.kind,String(value.basisPoints)]} };
const encodeScalars = (scalars: readonly string[]): Uint8Array => encoder.encode(scalars.map((s)=>{const n=s.normalize("NFC");return `${String(encoder.encode(n).length)}:${n}`}).join(""));
const digest = async (prefix: string, scalars: readonly string[]): Promise<Identifier> => { const material=Uint8Array.from(encodeScalars(scalars)).buffer; const bytes=await globalThis.crypto.subtle.digest("SHA-256",material); const hex=Array.from(new Uint8Array(bytes),(b)=>b.toString(16).padStart(2,"0")).join(""); return new Identifier(`${prefix}${hex}`) };
const reference = (kind: SemanticReferenceKind, identity: Identifier): SemanticReference => Object.freeze({kind,identity});
const diagnostic = (code: SemanticDiagnosticCode,message:string,fields:{readonly evidenceId?:Identifier;readonly componentId?:Identifier;readonly ruleIdentity?:SemanticRuleIdentity}={}):SemanticDiagnostic=>Object.freeze({code,message,...fields});
const failure = (diagnostics:readonly SemanticDiagnostic[]):ResolveEvidenceSemanticsResult=>Object.freeze({ok:false,diagnostics:Object.freeze([...diagnostics])});
const validPrefix=(id:Identifier,prefix:string):boolean=>id.value.startsWith(prefix)&&id.value===id.value.normalize("NFC");

const factFor=async(evidence:Evidence,component:EvidenceComponent):Promise<SemanticFact>=>{
  const evidenceReference=reference("EVIDENCE",evidence.id); const componentReference=reference("EVIDENCE_COMPONENT",component.id);
  const predicate:SemanticPredicate=Object.freeze({namespace:component.relation.namespace,name:component.relation.name});
  const provenance:SemanticProvenance=Object.freeze({evidenceReference,componentReference,projectionRule,referenceRule,semanticSchemaVersion:SEMANTIC_SCHEMA_VERSION,resolverVersion:SEMANTIC_RESOLVER_VERSION});
  const id=await digest("semantic-fact:v1:",["semantic-fact:v1",evidence.id.value,component.id.value,predicate.namespace,predicate.name,...valueScalars(component.value),SEMANTIC_SCHEMA_VERSION,ES_001_IDENTITY,ES_001_VERSION,ES_002_IDENTITY,ES_002_VERSION,SEMANTIC_RESOLVER_VERSION]);
  return Object.freeze({id,predicate,value:Object.freeze({...component.value}) as EvidenceValue,provenance});
};

export async function resolveEvidenceSemantics(input:ResolveEvidenceSemanticsInput):Promise<ResolveEvidenceSemanticsResult>{
  if(typeof input!=="object"||input===null)return failure([diagnostic("SEMANTIC_INPUT_INVALID","Semantic input is invalid.")]);
  if(input.semanticSchemaVersion!==SEMANTIC_SCHEMA_VERSION)return failure([diagnostic("SEMANTIC_SCHEMA_UNSUPPORTED","Semantic schema is unsupported.")]);
  if(!(input.evidence instanceof Evidence)||!validPrefix(input.evidence.id,"evidence:v2:"))return failure([diagnostic("SEMANTIC_INPUT_INVALID","Evidence is invalid.")]);
  const evidence=input.evidence; const componentIds=new Set<string>();
  for(const component of evidence.components){if(!(component instanceof EvidenceComponent)||!validPrefix(component.id,"evidence-component:v1:")||componentIds.has(component.id.value))return failure([diagnostic("SEMANTIC_PROVENANCE_INCOMPLETE","Evidence component lineage is invalid.",{evidenceId:evidence.id})]);componentIds.add(component.id.value)}
  const facts=await Promise.all(evidence.components.map((component)=>factFor(evidence,component)));
  facts.sort((a,b)=>compareFields([a.provenance.componentReference.identity.value,a.predicate.namespace,a.predicate.name,a.id.value],[b.provenance.componentReference.identity.value,b.predicate.namespace,b.predicate.name,b.id.value]));
  const keys=new Set<string>(); for(const fact of facts){const key=`${fact.provenance.componentReference.identity.value}\u0000${fact.predicate.namespace}\u0000${fact.predicate.name}`;if(keys.has(key))return failure([diagnostic("SEMANTIC_CONFLICT","Semantic output conflicts.",{evidenceId:evidence.id,componentId:fact.provenance.componentReference.identity})]);keys.add(key)}
  const byComponent=new Map(facts.map((fact)=>[fact.provenance.componentReference.identity.value,fact]));
  const resolutions:SemanticResolutionRecord[]=evidence.components.map((component)=>{const fact=byComponent.get(component.id.value);if(fact===undefined)throw new Error("Semantic resolution accountability invariant failed.");return Object.freeze({componentReference:reference("EVIDENCE_COMPONENT",component.id),status:"RESOLVED" as const,semanticFactIds:Object.freeze([fact.id]),diagnosticCodes:Object.freeze([]) as readonly SemanticDiagnosticCode[]})});
  resolutions.sort((a,b)=>compareFields([a.componentReference.identity.value,a.status,a.semanticFactIds.map((id)=>id.value).join("")],[b.componentReference.identity.value,b.status,b.semanticFactIds.map((id)=>id.value).join("")]));
  const aggregateId=await digest("evidence-semantics:v1:",["evidence-semantics:v1",evidence.id.value,SEMANTIC_SCHEMA_VERSION,SEMANTIC_RESOLVER_VERSION,String(facts.length),...facts.map((fact)=>fact.id.value),String(resolutions.length),...resolutions.flatMap((record)=>[record.componentReference.identity.value,record.status,String(record.semanticFactIds.length),...record.semanticFactIds.map((id)=>id.value),String(record.diagnosticCodes.length),...record.diagnosticCodes])]);
  const diagnostics=Object.freeze([]) as readonly SemanticDiagnostic[];
  const value:EvidenceSemantics=Object.freeze({id:aggregateId,evidenceReference:reference("EVIDENCE",evidence.id),semanticSchemaVersion:SEMANTIC_SCHEMA_VERSION,resolverVersion:SEMANTIC_RESOLVER_VERSION,facts:Object.freeze([...facts]),resolutions:Object.freeze([...resolutions]),diagnostics});
  return Object.freeze({ok:true,value,diagnostics});
}
