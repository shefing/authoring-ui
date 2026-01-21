'use client'
import * as React from 'react'
import {Button} from './components/ui/button'
import {Input} from './components/ui/input'
import {Label} from './components/ui/label'
import {Select} from './components/ui/select'
import {Card, CardContent, CardHeader, CardTitle} from './components/ui/card'
import {coerceVarValue, extractInlineVarDefs, type VarDef} from './lib/vars'
import {cn} from './lib/utils'
import type { Branding, Template } from '@/payload-types'
import {MessagePreview} from './components/MessagePreview'
import type { TemplateSummary } from './lib/payload-server'

type Props = { templates: TemplateSummary[] }

type VarRow = { id: string; key: string; value: string }

export default function ClientComposer({
  templates,
  initialTemplateId,
  initialDraft,
  initialTemplateData,
}: Props & {
  initialTemplateId?: string
  initialDraft?: boolean
  initialTemplateData?: Template | null
}) {
  const [templateId, setTemplateId] = React.useState<string>(initialTemplateId || '')
  const [draft, setDraft] = React.useState(!!initialDraft)
  const [rows, setRows] = React.useState<VarRow[]>([
    { id: crypto.randomUUID(), key: '', value: '' },
  ])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [preview, setPreview] = React.useState<{
    html: string
    title?: string
    device?: {
      actions?: any[]
      [key: string]: any
    }
    teams?: any
  } | null>(null)
  const [tplJson, setTplJson] = React.useState<Template | null>(initialTemplateData || null)
  const [inlineVars, setInlineVars] = React.useState<VarDef[]>(
    initialTemplateData ? extractInlineVarDefs(initialTemplateData) : [],
  )
  const [inlineValues, setInlineValues] = React.useState<Record<string, string>>(() => {
    if (!initialTemplateData) return {}
    const defs = extractInlineVarDefs(initialTemplateData)
    const init: Record<string, string> = {}
    for (const d of defs) {
      if (d.sampleValue != null) init[d.key] = String(d.sampleValue)
    }
    return init
  })
  const [branding, setBranding] = React.useState<Branding | null>(null)
  const [showPopup, setShowPopup] = React.useState(false)
  const [validationErrors, setValidationErrors] = React.useState<Set<string>>(new Set())

  const selected = templates.find((t) => t.id === templateId)

  // Load full template (depth=2) when selection changes to build dynamic var form
  React.useEffect(() => {
    let active = true
    async function load() {
      if (!templateId) {
        setTplJson(null)
        setInlineVars([])
        setInlineValues({})
        setBranding(null)
        return
      }
      try {
        const res = await fetch(`/api/templates/${templateId}`, { cache: 'no-store' })
        const data = await res.json()
        if (!active) return
        if (!res.ok) throw new Error(data?.error || 'failed to load template')
        
        setTplJson(data)
        const defs = extractInlineVarDefs(data)
        setInlineVars(defs)
        // initialize default values (sampleValue if present)
        const init: Record<string, string> = {}
        for (const d of defs) {
          if (d.sampleValue != null) init[d.key] = String(d.sampleValue)
        }
        setInlineValues(init)

        // Fetch branding package if referenced
        if (data.branding) {
          const brandingId =
            typeof data.branding === 'object' ? data.branding.id : data.branding
          if (brandingId) {
            const brandingRes = await fetch(`/api/branding-packages/${brandingId}`, {
              cache: 'no-store',
            })
            if (brandingRes.ok) {
              const brandingData = await brandingRes.json()
              if (active) setBranding(brandingData)
            }
          }
        } else {
          setBranding(null)
        }
      } catch (e: any) {
        console.error(e)
        if (active) setError(e?.message || 'Failed to load template')
      }
    }
    load()
    return () => {
      active = false
    }
  }, [templateId, draft])

  function addRow() {
    setRows((r) => [...r, { id: crypto.randomUUID(), key: '', value: '' }])
  }
  function updateRow(id: string, patch: Partial<VarRow>) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }
  function removeRow(id: string) {
    setRows((r) => (r.length > 1 ? r.filter((x) => x.id !== id) : r))
  }

  async function doPreview() {
    // Validate required fields
    const errors = new Set<string>()
    for (const v of inlineVars) {
      if (v.required) {
        const value = inlineValues[v.key]
        if (!value || value.trim() === '') {
          errors.add(v.key)
        }
      }
    }

    setValidationErrors(errors)

    // If there are validation errors, don't proceed
    if (errors.size > 0) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)
    setPreview(null)
    try {
      const vars: Record<string, any> = {}
      // from dynamic inline vars (coerce types)
      for (const d of inlineVars) {
        const v = inlineValues[d.key]
        if (v != null && v !== '') vars[d.key] = coerceVarValue(d.type, v)
        else if (d.required) vars[d.key] = ''
      }
      // additional manual rows
      for (const { key, value } of rows) {
        if (key && !(key in vars)) vars[key] = value
      }
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      const token = process.env.NEXT_PUBLIC_FRONTEND_PREVIEW_TOKEN
      if (token) headers['X-Preview-Token'] = token

      const res = await fetch('/api/preview', {
        method: 'POST',
        headers,
        body: JSON.stringify({ templateId, draft, variables: vars }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Preview failed')
      setPreview(data.preview)
      setShowPopup(true)
    } catch (e: any) {
      setError(e?.message || 'Preview failed')
    } finally {
      setLoading(false)
    }
  }

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New Message — Preview</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="template">Template</Label>
            <Select
              id="template"
              value={templateId}
              onChange={(e) => {
                setTemplateId(e.target.value)
                setPreview(null) // Reset preview when template changes
                setShowPopup(false) // Close popup if open
              }}
            >
              <option value="">Select a template…</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name || t.slug} {t._status === 'draft' ? '(Draft)' : ''}
                </option>
              ))}
            </Select>
            {selected && <p className="mt-1 text-xs text-gray-500">ID: {selected.id}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="draft"
              type="checkbox"
              checked={draft}
              onChange={(e) => setDraft(e.target.checked)}
            />
            <Label htmlFor="draft">Use draft (if exists)</Label>
          </div>

          {inlineVars.length > 0 && (
            <div className="space-y-2">
              <Label>Required Variables (from template)</Label>
              <div className="space-y-2">
                {inlineVars.map((v) => {
                  const hasError = validationErrors.has(v.key)
                  return (
                    <div key={v.id} className="grid grid-cols-12 items-center gap-2">
                      <div className="col-span-5">
                        <Label>
                          {v.label || v.key}
                          {v.required && <span style={{ color: '#dc2626' }}> *</span>}
                        </Label>
                        {v.formatHint && <p className="text-xs text-gray-500">{v.formatHint}</p>}
                      </div>
                      <div className="col-span-7">
                        {v.type === 'enum' && Array.isArray(v.enumOptions) ? (
                          <Select
                            value={inlineValues[v.key] ?? ''}
                            onChange={(e) => {
                              setInlineValues((m) => ({ ...m, [v.key]: e.target.value }))
                              // Clear validation error when user types
                              if (hasError) {
                                setValidationErrors((prev) => {
                                  const next = new Set(prev)
                                  next.delete(v.key)
                                  return next
                                })
                              }
                            }}
                            className={cn(hasError && 'border-red-600 border-2 outline-none')}
                          >
                            <option value="">Select…</option>
                            {v.enumOptions.map((opt, i) => (
                              <option key={i} value={opt.value}>
                                {opt.label || opt.value}
                              </option>
                            ))}
                          </Select>
                        ) : v.type === 'boolean' ? (
                          <div className="flex items-center gap-2">
                            <input
                              id={`bool-${v.key}`}
                              type="checkbox"
                              checked={inlineValues[v.key] === 'true'}
                              onChange={(e) => {
                                setInlineValues((m) => ({
                                  ...m,
                                  [v.key]: e.target.checked ? 'true' : 'false',
                                }))
                                // Clear validation error when user interacts
                                if (hasError) {
                                  setValidationErrors((prev) => {
                                    const next = new Set(prev)
                                    next.delete(v.key)
                                    return next
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={`bool-${v.key}`}>{v.label || v.key}</Label>
                          </div>
                        ) : (
                          <Input
                            placeholder={v.sampleValue || v.formatHint || v.key}
                            value={inlineValues[v.key] ?? ''}
                            onChange={(e) => {
                              setInlineValues((m) => ({ ...m, [v.key]: e.target.value }))
                              // Clear validation error when user types
                              if (hasError) {
                                setValidationErrors((prev) => {
                                  const next = new Set(prev)
                                  next.delete(v.key)
                                  return next
                                })
                              }
                            }}
                            className={cn(hasError && 'border-red-600 border-2 outline-none')}
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          <div>
            <Button type="button" onClick={doPreview} disabled={!templateId || loading}>
              {loading ? 'Generating preview…' : 'Preview'}
            </Button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {preview ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">HTML Rendered (Raw)</h3>
                    <div className="max-h-64 overflow-auto rounded border border-gray-200 bg-white p-3 text-sm">
                      <div dangerouslySetInnerHTML={{ __html: preview.html }} />
                    </div>
                  </div>
                  {showPopup && (
                    <MessagePreview
                      content={{
                        title: preview.title || 'Message',
                        body: tplJson?.body || 'No content',
                        actions: preview.device?.actions || [],
                      }}
                      branding={branding}
                      asPopup={true}
                      onClose={handleClosePopup}
                      variableValues={inlineValues}
                      previewHtml={preview.html}
                    />
                  )}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Generated JSON (Device)</h3>
                    <pre className="max-h-64 overflow-auto rounded bg-gray-50 p-3 text-xs">
                      {JSON.stringify(preview.device, null, 2)}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-red-600">Debug: Lexical JSON (Raw)</h3>
                    <pre className="max-h-64 overflow-auto rounded border border-red-200 bg-red-50 p-3 text-xs">
                      {JSON.stringify(tplJson?.body || tplJson, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No preview yet. Select a template and click Preview.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teams Preview (Adaptive Card)</CardTitle>
            </CardHeader>
            <CardContent>
              {preview ? (
                <pre className="max-h-96 overflow-auto rounded bg-gray-50 p-3 text-xs">
                  {JSON.stringify(preview.teams, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-gray-500">No preview yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
