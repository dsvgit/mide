import { useMemo } from 'react'
import { Element } from 'slate'
import { useSlate } from 'slate-react'

// set editor.intervals with intervals of a continuous stream of identical elements
// set editor.intervalsStarts with set of these intervals start index (for optimization)
export const ExtractIntervals = () => {
  const editor = useSlate()

  useMemo(() => {
    const intervals = new Map<string, [number, number][]>()
    let prev = null
    // the loop has children.length + 1 iterations in order to close the last interval
    for (let i = 0; i < editor.children.length + 1; i++) {
      const element = editor.children[i] as Element

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
        }
      }

      prev = element
    }

    editor.intervals = intervals
  }, [editor.children])

  return null
}
