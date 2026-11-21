import { atom, read, update } from 'claude-code'
import type { Register, Timer } from 'claude-code'

import type { Mood } from '../types'

const mood = atom({ plugin: 'task-buddy', key: 'mood' } as const, 'sleep' as Mood)
const frame = atom({ plugin: 'task-buddy', key: 'frame' } as const, 0)
const isHidden = atom({ plugin: 'task-buddy', key: 'isHidden' } as const, false)

const TRACK = 14

const runFrames = (): string[] => {
  const poses = ['ᕕ( ᐛ )ᕗ', 'ᕙ( ᐛ )ᕗ']
  const out: string[] = []
  for (let i = 0; i < TRACK; i++) out.push(' '.repeat(i) + poses[i % 2] + ' '.repeat(TRACK - i))
  for (let i = TRACK; i > 0; i--) out.push(' '.repeat(i) + poses[i % 2] + ' '.repeat(TRACK - i))
  return out
}

const SCENES: Record<Mood, { frames: string[]; label: string }> = {
  sleep: { frames: ['(-_-)  z', '(-_-)  zZ', '(-_-)  zZz', '(-_-)  zZ'], label: 'napping' },
  think: { frames: ['(・_・ )  ?', '( ・_・)  ?', '(・_・ )  ..', '( ・_・)  ...'], label: 'thinking' },
  run: { frames: runFrames(), label: 'running a command' },
  search: { frames: ['(⌐■_■)🔍', '(⌐■_■) 🔍', '(⌐■_■)  🔍', '(⌐■_■) 🔍'], label: 'looking around' },
  write: { frames: ['(•_•)⌨  tap', '(•_• )⌨  tap tap', '( •_•)⌨  tap', '(•_•)⌨  ✎'], label: 'writing code' },
  web: { frames: ['🌐  ヾ(・ω・)', '🌐  ヾ(・ω・)ノ', '🌐 ヾ(・ω・)', '🌐 ヾ(・ω・)ノ'], label: 'on the web' },
  team: { frames: ['(•‿•) → (•‿•)', '(•‿•)  → (•‿•)', '(•‿•) ← (•‿•)', '(•‿•)← (•‿•)'], label: 'asking a helper' },
  dance: { frames: ['♪┏(・o･)┛♪', '♪┗(・o･)┓♪', '♫┏(・o･)┛♫', '♫┗(・o･)┓♫'], label: 'done!' },
}

const moodFor = (tool: string): Mood => {
  if (tool === 'Bash' || tool === 'PowerShell') return 'run'
  if (tool === 'Read' || tool === 'Grep' || tool === 'Glob' || tool === 'LS') return 'search'
  if (tool === 'Edit' || tool === 'Write' || tool === 'MultiEdit' || tool === 'NotebookEdit') return 'write'
  if (tool === 'WebSearch' || tool === 'WebFetch' || tool.startsWith('mcp__')) return 'web'
  if (tool === 'Agent' || tool === 'Task') return 'team'
  return 'think'
}

export const register: Register = on => {
  let rest: Timer | undefined

  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'buddy', description: 'Show or hide the Claude buddy' })
    await update($, mood, () => 'sleep')
    $.clock.every(300, () => {
      void update($, frame, n => (n + 1) % 1000)
    })
    return next(e)
  })

  on('command.run', { command: 'buddy' }, async $ => {
    const hidden = await update($, isHidden, v => !v)
    return { text: hidden ? 'Buddy hidden.' : 'Buddy is back.' }
  })

  on('prompt.submit', async ($, e, next) => {
    rest?.cancel()
    await update($, mood, () => 'think')
    return next(e)
  }).catch(($, e, next) => (next.called ? undefined : next(e)))

  on('tool.call', async ($, e, next) => {
    if (e.agentId === undefined) await update($, mood, () => moodFor(e.tool))
    const result = await next(e)
    if (e.agentId === undefined) await update($, mood, () => 'think')
    return result
  }).catch(($, e, next) => (next.called ? undefined : next(e)))

  on('turn.complete', async ($, e, next) => {
    await update($, mood, () => 'dance')
    rest?.cancel()
    rest = $.clock.after(4000, () => {
      void update($, mood, () => 'sleep')
    })
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (await read($, isHidden))) return next(e)

    const scene = SCENES[await read($, mood)]
    const pose = scene.frames[(await read($, frame)) % scene.frames.length]
    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box>
        <Text color="claude">{pose}</Text>
        <Text dimColor>  {scene.label}</Text>
      </Box>
    )
  })
}
