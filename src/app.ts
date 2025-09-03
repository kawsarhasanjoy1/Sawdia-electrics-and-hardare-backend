import express from 'express'
import cors from 'cors'
import router from './app/route/router'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import { notFound } from './app/middleware/notFound'
export const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api/v1', router)
app.use(globalErrorHandler)
app.use(notFound)
