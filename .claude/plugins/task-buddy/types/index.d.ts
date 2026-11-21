export type Mood = 'sleep' | 'think' | 'run' | 'search' | 'write' | 'web' | 'team' | 'dance'

declare module 'claude-code' {
  interface PluginState {
    'task-buddy': { mood: Mood; frame: number; isHidden: boolean }
  }
}
