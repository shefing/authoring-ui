export type MessageContent = {
  title: string
  body: string | any // Can be plain string or Lexical rich text object
  actions?: Array<{ kind: string; label: string }>
}
