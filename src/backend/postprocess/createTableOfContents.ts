import { ParserContext } from '../parser'

export interface TableOfContents {
  roots: TableOfContentsNode[]
}

export interface TableOfContentsNode {
  level: number
  content: string
  id: string
  children?: TableOfContentsNode[]
}

export type AugmentedTableOfContentsNode = TableOfContentsNode & {
  parent?: TableOfContentsNode
}

export function createTableOfContents(context: ParserContext): TableOfContents {
  const tableOfContents = {
    roots: [] as AugmentedTableOfContentsNode[],
  }

  if (!context.headings.length) return tableOfContents

  let currentLeaf: AugmentedTableOfContentsNode | undefined = undefined

  for (const node of context.headings) {
    const parent = findNearestParent(node, currentLeaf)

    if (parent) {
      parent.children ??= []
      parent.children.push(node)
      node.parent = parent
    } else {
      tableOfContents.roots.push(node)
    }
    currentLeaf = node
  }

  tableOfContents.roots = tableOfContents.roots.map(eraseParent)

  return tableOfContents
}

function findNearestParent(
  target: AugmentedTableOfContentsNode,
  current?: AugmentedTableOfContentsNode
): AugmentedTableOfContentsNode | undefined {
  if (!current) {
    return undefined
  }
  if (current.level < target.level) {
    return current
  }
  return findNearestParent(target, current.parent)
}

function eraseParent(node: AugmentedTableOfContentsNode): TableOfContentsNode {
  const erasedNode: TableOfContentsNode = {
    content: node.content,
    id: node.id,
    level: node.level,
  }
  if (node.children) {
    erasedNode.children = node.children.map(eraseParent)
  }
  return erasedNode
}
