import { test, expect } from 'vitest'
import { botCheck } from './botometer.js'

test('botometer score', async () => {

  const result = await botCheck('@twilson63')
  expect(result).toBe(true)
})