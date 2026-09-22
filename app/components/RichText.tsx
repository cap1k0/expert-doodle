import React from 'react'

type LexicalNode = {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number
  tag?: string
  url?: string
  listType?: string
  [key: string]: unknown
}

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2

function renderText(node: LexicalNode, key: number) {
  let content: React.ReactNode = node.text
  if (node.format && node.format & FORMAT_BOLD) content = <strong>{content}</strong>
  if (node.format && node.format & FORMAT_ITALIC) content = <em>{content}</em>
  return <React.Fragment key={key}>{content}</React.Fragment>
}

function renderNode(node: LexicalNode, key: number): React.ReactNode {
  const children = node.children?.map((child, i) => renderNode(child, i))

  switch (node.type) {
    case 'text':
      return renderText(node, key)
    case 'paragraph':
      return <p key={key}>{children}</p>
    case 'heading': {
      const Tag = (node.tag as keyof React.JSX.IntrinsicElements) || 'h2'
      return <Tag key={key}>{children}</Tag>
    }
    case 'link':
      return (
        <a key={key} href={node.url} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    case 'list': {
      const ListTag = node.listType === 'number' ? 'ol' : 'ul'
      return <ListTag key={key}>{children}</ListTag>
    }
    case 'listitem':
      return <li key={key}>{children}</li>
    case 'quote':
      return <blockquote key={key}>{children}</blockquote>
    case 'linebreak':
      return <br key={key} />
    default:
      return <React.Fragment key={key}>{children}</React.Fragment>
  }
}

export default function RichText({ data }: { data: unknown }) {
  const root = (data as { root?: { children?: LexicalNode[] } })?.root
  if (!root?.children?.length) return null

  return <>{root.children.map((node, i) => renderNode(node, i))}</>
}
