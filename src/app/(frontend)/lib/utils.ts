import TailWindColors from "@/components/color-picker/TailWindColors"

export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ')
}

export function resolveTailwindColor(colorName: string | undefined | null): string {
  if (!colorName) return ''
  if (colorName.startsWith('#') || colorName.startsWith('rgb')) return colorName

  if (colorName === 'white') return '#ffffff'
  if (colorName === 'black') return '#000000'

  const parts = colorName.split('-')
  if (parts.length < 2) return colorName

  const category = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
  const shade = parts[1]
  
  const colorArray = (TailWindColors as any)[category]
  if (!colorArray) return colorName

  // shade is like 50, 100, 200, ..., 900, 950
  let index = 0
  if (shade === '50') index = 0
  else if (shade === '950') index = 10
  else {
    index = Math.floor(parseInt(shade) / 100)
  }

  return colorArray[index] || colorName
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

export function extractPlainText(input: any, vars: Record<string, any> = {}): string {
  if (!input) return ''

  // If it's a string, just return it
  if (typeof input === 'string') return input

  const parts: string[] = []

  const walk = (node: any) => {
    if (!node) return

    if (typeof node === 'string') {
      parts.push(node)
      return
    }

    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }

    if (typeof node === 'object') {
      // Handle Lexical node types
      switch (node.type) {
        case 'text':
          if (node.text) parts.push(node.text)
          break
        case 'linebreak':
          parts.push('\n')
          break
        case 'paragraph':
          if (parts.length > 0 && parts[parts.length - 1] !== '\n') {
            parts.push('\n')
          }
          if (node.children) node.children.forEach(walk)
          parts.push('\n')
          break
        case 'heading':
        case 'quote':
          if (parts.length > 0 && parts[parts.length - 1] !== '\n') {
            parts.push('\n')
          }
          if (node.children) node.children.forEach(walk)
          parts.push('\n')
          break
        case 'list':
          if (node.children) node.children.forEach(walk)
          parts.push('\n')
          break
        case 'listitem':
          parts.push('- ')
          if (node.children) node.children.forEach(walk)
          parts.push('\n')
          break
        case 'tab':
          parts.push('\t')
          break
        case 'inlineBlock':
        case 'block': {
          const fields = node.fields
          if (fields?.blockType === 'var' || node.blockType === 'var' || node.slug === 'var') {
            const variable = fields?.variable || node.fields?.variable
            const key = variable?.key || variable?.name || (typeof variable === 'string' ? variable : '')
            if (key) {
              if (vars[key] != null) parts.push(String(vars[key]))
              else parts.push(`{{${key}}}`)
            }
          } else if (node.children) {
            node.children.forEach(walk)
          }
          break
        }
        default:
          // For blocks (var, image, etc.) or unknown nodes
          if (node.children) {
            node.children.forEach(walk)
          } else if (node.root) {
            walk(node.root)
          } else if (node.body) {
            walk(node.body)
          } else if (node.fields) {
            // Special handling for 'var' block if it doesn't have children but has fields
            if (node.blockType === 'var' || node.slug === 'var') {
              const variable = node.fields?.variable
              const key = variable?.key || variable?.name || (typeof variable === 'string' ? variable : '')
              if (key) {
                if (vars[key] != null) parts.push(String(vars[key]))
                else parts.push(`{{${key}}}`)
              }
            } else {
              walk(node.fields)
            }
          } else {
            // Generic object traversal as fallback
            for (const [k, v] of Object.entries(node)) {
              if (k !== 'type' && k !== 'format' && k !== 'version') {
                walk(v)
              }
            }
          }
      }
    }
  }

  walk(input)

  // Clean up extra newlines
  return parts.join('').replace(/\n{3,}/g, '\n\n')
}

export function extractHtml(input: any, vars: Record<string, any> = {}): string {
  if (!input) return ''
  if (typeof input === 'string') return `<p>${input}</p>`

  const walk = (node: any): string => {
    if (!node) return ''
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(walk).join('')

    if (typeof node === 'object') {
      switch (node.type) {
        case 'text': {
          let text = node.text || ''
          if (node.format) {
            if (node.format & 1) text = `<strong>${text}</strong>`
            if (node.format & 2) text = `<em>${text}</em>`
            if (node.format & 4) text = `<strike>${text}</strike>`
            if (node.format & 8 || node.format & 16) text = `<u>${text}</u>`
          }
          return text
        }
        case 'linebreak':
          return '<br />'
        case 'paragraph':
          return `<p>${(node.children || []).map(walk).join('')}</p>`
        case 'heading': {
          const Tag = node.tag || 'h2'
          return `<${Tag}>${(node.children || []).map(walk).join('')}</${Tag}>`
        }
        case 'quote':
          return `<blockquote>${(node.children || []).map(walk).join('')}</blockquote>`
        case 'list': {
          const Tag = node.listType === 'number' ? 'ol' : 'ul'
          return `<${Tag}>${(node.children || []).map(walk).join('')}</${Tag}>`
        }
        case 'listitem':
          return `<li>${(node.children || []).map(walk).join('')}</li>`
        case 'tab':
          return '&nbsp;&nbsp;&nbsp;&nbsp;'
        case 'inlineBlock':
        case 'block': {
          const fields = node.fields
          if (fields?.blockType === 'var' || node.blockType === 'var' || node.slug === 'var') {
            const variable = fields?.variable || node.fields?.variable
            const key = variable?.key || variable?.name || (typeof variable === 'string' ? variable : '')
            if (key && vars[key] != null) return String(vars[key])
            return key ? `{{${key}}}` : ''
          }
          if (node.children) return node.children.map(walk).join('')
          return ''
        }
        default:
          if (node.blockType === 'var' || node.slug === 'var') {
            const variable = node.fields?.variable
            const key = variable?.key || variable?.name || (typeof variable === 'string' ? variable : '')
            if (key && vars[key] != null) return String(vars[key])
            return key ? `{{${key}}}` : ''
          }
          if (node.children) return node.children.map(walk).join('')
          if (node.root) return walk(node.root)
          if (node.body) return walk(node.body)
          if (node.fields) return walk(node.fields)
          return ''
      }
    }
    return ''
  }

  return walk(input)
}
