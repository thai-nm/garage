import { expect, test } from 'claude-code/testing'

const BAND = {
  plugin: 'task-buddy',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isCollapsed: false, isWorking: false, rows: 10 },
} as const

test('the buddy naps, then runs while Bash runs', async ($, on) => {
  on('command.register', () => ({ value: { command: 'buddy' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  let seen = ''
  on('tool.call', async () => {
    const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
    seen = (await ui.find({ type: 'Text', text: /running/ }))?.text ?? ''
    await ui.unmount()
    return { result: {} }
  })

  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect((await ui.find({ type: 'Text', text: /napping/ }))?.text).toContain('napping')
    await ui.unmount()
  }

  await $.tool.call({ tool: 'Bash', command: 'ls' })
  expect(seen).toContain('running a command')

  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect((await ui.find({ type: 'Text', text: /thinking/ }))?.text).toContain('thinking')
  await ui.unmount()
})

test('/buddy hides the band', async ($, on) => {
  on('command.register', () => ({ value: { command: 'buddy' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine</Text>
  })

  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })
  await $.command.run({ command: 'buddy' })

  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect((await ui.find({ type: 'Text', text: /engine/ }))?.text).toBe('engine')
  await ui.unmount()
})
