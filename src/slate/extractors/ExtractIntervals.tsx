import { Element } from 'slate'
import { useSlate } from 'slate-react'

// set editor.intervals with intervals of a continuous stream of identical elements
// set editor.intervalsStarts with set of these intervals start index (for optimization)
export const ExtractIntervals = () => {
  const editor = useSlate()
  const children = editor.children

  const intervals = new Map<string, [number, number][]>()
  const intervalsStarts = new Map<string, Set<number>>()
  let prev = null
  // the loop has children.length + 1 iterations in order to close the last interval
  for (let i = 0; i < children.length + 1; i++) {
    const element = children[i] as Element

    if (!prev || !element || prev.type !== element.type) {
      if (prev) {
        // update the end of an interval
        intervals.get(prev.type)!.slice(-1)[0][1] = i - 1
      }

      if (element) {
        if (!intervals.has(element.type)) {
          intervals.set(element.type, [])
        }
        // push the start of an interval
        intervals.get(element.type)!.push([i, 0])

        if (!intervalsStarts.has(element.type)) {
          intervalsStarts.set(element.type, new Set())
        }
        intervalsStarts.get(element.type)!.add(i)
      }
    }

    prev = element
  }

  editor.intervals = intervals

  return null
}
