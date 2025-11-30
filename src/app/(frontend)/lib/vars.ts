export type VarDef = {
  id: string
  key: string
  label?: string
  type?: string
  required?: boolean
  enumOptions?: Array<{ value: string; label?: string }>
  formatHint?: string
  sampleValue?: string
}

function collectNodes(node: any, out: any[]) {
  if (!node) return
  if (Array.isArray(node)) {
    node.forEach((n) => collectNodes(n, out))
    return
  }
  if (typeof node === 'object') {
    out.push(node)
    for (const v of Object.values(node)) collectNodes(v, out)
  }
}

/**
 * Best-effort extraction of inline var references from Payload richText (Lexical) JSON.
 * Looks for blocks with blockType === 'var' and dereferences the related Variable doc when present (depth>=2).
 */
export function extractInlineVarDefs(template: any): VarDef[] {
  const nodes: any[] = []
  collectNodes(template?.body ?? template, nodes)

  const seen = new Map<string, VarDef>()

  for (const n of nodes) {
    // blockType === 'var' path
    if (n && typeof n === 'object' && (n.blockType === 'var' || n.slug === 'var')) {
      const fields = (n as any).fields || n
      const rel = fields?.variable
      let id: string | undefined
      let doc: any | undefined
      if (rel && typeof rel === 'object') {
        if ('value' in rel && (typeof rel.value === 'string' || typeof rel.value === 'number')) {
          id = String(rel.value)
          // when depth>=2, rel.value can be populated object as well
          if (typeof rel.value === 'object' && rel.value) {
            doc = rel.value
            id = String(doc.id || doc._id || id)
          }
        } else if ('id' in rel) {
          id = String(rel.id)
          doc = rel
        }
      } else if (typeof rel === 'string') {
        id = rel
      }

      if (id && !seen.has(id)) {
        const key = doc?.key || doc?.slug || doc?.name || id
        seen.set(id, {
          id,
          key,
          label: doc?.label,
          type: doc?.type,
          required: !!doc?.required,
          enumOptions: doc?.enumOptions,
          formatHint: doc?.formatHint,
          sampleValue: doc?.sampleValue,
        })
      }
    }
  }

  return Array.from(seen.values())
}

/** Coerce string input values to typed values based on Variable type. */
export function coerceVarValue(type: string | undefined, value: string) {
  switch (type) {
    case 'number': {
      const n = Number(value)
      return Number.isFinite(n) ? n : value
    }
    case 'boolean':
      return value === 'true' || value === '1' || value === 'on'
    case 'date':
    case 'dateTime':
      return value // keep as ISO-ish string; server can parse if needed
    default:
      return value
  }
}
