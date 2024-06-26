import morgan from "morgan"
import dontenv from 'dotenv'
import express from "express"
import createError from "http-errors"
import db from "./Config/Sequelize.js"
import AuthRoute from "./Routes/AuthRoute.js"
import cors from "cors"

dontenv.config()

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: ["http://localhost:3000", "https://misalud.vercel.app"],
  default: "https://misalud.vercel.app/"
}))

// ;(async()=>{
//   await db.sync({force: true});
// })();

app.use('/api/v1/auth', AuthRoute)

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port: ${process.env.PORT || 3000}`)
})

export default app