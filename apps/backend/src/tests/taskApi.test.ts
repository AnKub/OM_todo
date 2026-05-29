import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../app/createApp'

describe('tasks api', () => {
  it('returns an empty list by default', async () => {
    const { app } = createApp()

    const response = await request(app).get('/tasks')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })

  it('creates a task and returns it in the list', async () => {
    const { app } = createApp()

    const createResponse = await request(app).post('/tasks').send({ title: 'Prepare backend flow' })
    const listResponse = await request(app).get('/tasks')

    expect(createResponse.status).toBe(201)
    expect(createResponse.body.title).toBe('Prepare backend flow')
    expect(createResponse.body.id).toBeTruthy()
    expect(createResponse.body.createdAt).toBeTruthy()
    expect(listResponse.body).toHaveLength(1)
  })

  it('updates a task title', async () => {
    const { app } = createApp()

    const createResponse = await request(app).post('/tasks').send({ title: 'Draft old title' })
    const updateResponse = await request(app)
      .patch(`/tasks/${createResponse.body.id}`)
      .send({ title: 'Draft new title' })

    expect(updateResponse.status).toBe(200)
    expect(updateResponse.body.title).toBe('Draft new title')
  })

  it('deletes an existing task', async () => {
    const { app } = createApp()

    const createResponse = await request(app).post('/tasks').send({ title: 'Remove me' })
    const deleteResponse = await request(app).delete(`/tasks/${createResponse.body.id}`)
    const listResponse = await request(app).get('/tasks')

    expect(deleteResponse.status).toBe(204)
    expect(listResponse.body).toEqual([])
  })

  it('rejects an empty title', async () => {
    const { app } = createApp()

    const response = await request(app).post('/tasks').send({ title: '   ' })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ message: 'Task title is required' })
  })
})