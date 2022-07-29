import { createMachine, state, transition, invoke, reduce } from 'robot3'
import { useMachine } from 'svelte-robot-factory'

const context = event => ({
  address: event.address
})

const machine = createMachine({
  welcome: state(
    transition('connect', 'connected',
      reduce((ctx, event) => ({ ...ctx, address: event.value }))
    )
  ),
  connected: state(
    transition('tweet', 'tweeted'),
    transition('already_tweeted', 'tweeted')
  ),
  tweeted: state(
    transition('submitSuccess', 'success'),
    transition('submitFailure', 'failure')
  ),
  success: state(),
  failure: state()
}, context)

const service = useMachine(machine, { address: null })
export default service