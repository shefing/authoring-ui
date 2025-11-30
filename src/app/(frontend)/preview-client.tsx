"use client"
import * as React from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Select } from './components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { extractInlineVarDefs, type VarDef, coerceVarValue } from './lib/vars'
import type { TemplateSummary } from './lib/payload'

type Props = { templates: TemplateSummary[] }

type VarRow = { id: string; key: string; value: string }

export default function ClientComposer({ templates, initialTemplateId, initialDraft }: Props & { initialTemplateId?: string; initialDraft?: boolean }) {
  const [templateId, setTemplateId] = React.useState<string>(initialTemplateId || '')
  const [draft, setDraft] = React.useState(!!initialDraft)
  const [rows, setRows] = React.useState<VarRow[]>([{ id: crypto.randomUUID(), key: '', value: '' }])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [preview, setPreview] = React.useState<any | null>(null)
  const [tplJson, setTplJson] = React.useState<any | null>(null)
  const [inlineVars, setInlineVars] = React.useState<VarDef[]>([])
  const [inlineValues, setInlineValues] = React.useState<Record<string, string>>({})

  const selected = templates.find((t) => t.id === templateId)

  // Load full template (depth=2) when selection changes to build dynamic var form
  React.useEffect(() => {
    async function load() {
      setTplJson(null)
      setInlineVars([])
      setInlineValues({})
      if (!templateId) return
      try {
       // const qs = new URLSearchParams({ draft: draft ? '1' : '0' }).toString()
        const res = await fetch(`/api/templates/${templateId}`, { cache: 'no-store' })
        const data = await res.json()
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
      } catch (e: any) {
        console.error(e)
        setError(e?.message || 'Failed to load template')
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch (e: any) {
      setError(e?.message || 'Preview failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New Message — Preview</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="template">Template</Label>
            <Select id="template" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
              <option value="">Select a published template…</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name || t.slug}
                </option>
              ))}
            </Select>
            {selected && <p className="mt-1 text-xs text-gray-500">ID: {selected.id}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input id="draft" type="checkbox" checked={draft} onChange={(e) => setDraft(e.target.checked)} />
            <Label htmlFor="draft">Use draft (if exists)</Label>
          </div>

          {inlineVars.length > 0 && (
            <div className="space-y-2">
              <Label>Required Variables (from template)</Label>
              <div className="space-y-2">
                {inlineVars.map((v) => (
                  <div key={v.id} className="grid grid-cols-12 items-center gap-2">
                    <div className="col-span-5">
                      <Label>{v.label || v.key}{v.required ? ' *' : ''}</Label>
                      {v.formatHint && <p className="text-xs text-gray-500">{v.formatHint}</p>}
                    </div>
                    <div className="col-span-7">
                      {v.type === 'enum' && Array.isArray(v.enumOptions) ? (
                        <Select
                          value={inlineValues[v.key] ?? ''}
                          onChange={(e) => setInlineValues((m) => ({ ...m, [v.key]: e.target.value }))}
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
                            onChange={(e) => setInlineValues((m) => ({ ...m, [v.key]: e.target.checked ? 'true' : 'false' }))}
                          />
                          <Label htmlFor={`bool-${v.key}`}>{v.label || v.key}</Label>
                        </div>
                      ) : (
                        <Input
                          placeholder={v.sampleValue || v.formatHint || v.key}
                          value={inlineValues[v.key] ?? ''}
                          onChange={(e) => setInlineValues((m) => ({ ...m, [v.key]: e.target.value }))}
                        />
                      )}
                    </div>
                  </div>
                ))}
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
              <CardTitle>Device Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {preview ? (
                <pre className="max-h-96 overflow-auto rounded bg-gray-50 p-3 text-xs">{JSON.stringify(preview.device, null, 2)}</pre>
              ) : (
                <p className="text-sm text-gray-500">No preview yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teams Preview (Adaptive Card)</CardTitle>
            </CardHeader>
            <CardContent>
              {preview ? (
                <pre className="max-h-96 overflow-auto rounded bg-gray-50 p-3 text-xs">{JSON.stringify(preview.teams, null, 2)}</pre>
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
