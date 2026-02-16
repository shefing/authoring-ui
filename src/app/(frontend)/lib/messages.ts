export type MessageContent = {
  title: string
  body: string | object
  actions?: Array<{ kind: string; label: string; icon?: string }>
}
