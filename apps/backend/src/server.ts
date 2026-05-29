import { createApp } from './app/createApp'

const { app, config } = createApp()

app.listen(config.port, () => {
  console.log(`OMTODO API is running on port ${config.port}`)
})