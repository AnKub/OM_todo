import cors from 'cors'
import express from 'express'
import { createConfig } from '../config/createConfig'
import { createTaskRouter, TaskController, TaskService, TaskStore } from '../modules/tasks'
import { errorHandler } from '../shared/http/errorHandler'
import { notFoundHandler } from '../shared/http/notFoundHandler'

export function createApp() {
  const app = express()
  const config = createConfig()
  const taskStore = new TaskStore()
  const taskService = new TaskService(taskStore)
  const taskController = new TaskController(taskService)

  app.disable('x-powered-by')
  app.use(cors())
  app.use(express.json())

  app.get('/health', (_request, response) => {
    response.status(200).json({ service: 'omtodo-api', status: 'ready', port: config.port })
  })

  app.use('/tasks', createTaskRouter(taskController))
  app.use(notFoundHandler)
  app.use(errorHandler)

  return { app, config }
}