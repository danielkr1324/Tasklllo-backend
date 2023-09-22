const express = require("express")
const cors = require("cors")
const path = require("path")
const cookieParser = require("cookie-parser")

const app = express()
const http = require("http").createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "public")))
} else {
  const corsOptions = {
    origin: [
      "http://127.0.0.1:3000",
      "http://localhost:3000",
      "http://127.0.0.1:5174",
      "http://localhost:5174",
      "http://192.168.95.238:3000",
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

const authRoutes = require("./api/auth/auth.routes")
const userRoutes = require("./api/user/user.routes")
const boardRoutes = require("./api/board/board.routes")

// routes
const setupAsyncLocalStorage = require("./middlewares/setupAls.middleware")
app.all("*", setupAsyncLocalStorage)

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/board", boardRoutes)

app.get("/**", (req, res) => {
  res.sendFile(path.join(__dirname, "public"))
})

const port = process.env.PORT || 3030
http.listen(port, () => {
  console.log("Server is running on port: " + port)
})