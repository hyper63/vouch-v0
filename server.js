import { handler } from './build/handler.js'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors({ credentials: true }))
app.use(handler)
app.listen(3000)