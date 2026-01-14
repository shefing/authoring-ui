export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ')
}

export function deepReplacePlaceholders(input: any, vars: Record<string, any>): any {
  // Replace any string occurrences of {{key}} with provided values
  const replacer = (s: string) =>
    s.replace(/\{\{\s*([a-zA-Z][a-zA-Z0-9_\-]*)\s*\}\}/g, (_, key) =>
      vars[key] != null ? String(vars[key]) : `{{${key}}}`,
    )

  if (typeof input === 'string') return replacer(input)
  if (Array.isArray(input)) return input.map((v) => deepReplacePlaceholders(v, vars))
  if (input && typeof input === 'object') {
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(input)) {
      out[k] = deepReplacePlaceholders(v, vars)
    }
    return out
  }
  return input
}

export function extractPlainText(input: any): string {
  // Best-effort: collect strings in the structure
  const parts: string[] = []
  const walk = (node: any) => {
    if (!node) return
    if (typeof node === 'string') parts.push(node)
    else if (Array.isArray(node)) node.forEach(walk)
    else if (typeof node === 'object') {
      for (const v of Object.values(node)) walk(v as any)
    }
  }
  walk(input)
  return parts.join(' ')
}
