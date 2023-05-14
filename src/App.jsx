import { Route, Routes } from "react-router-dom"
import Login from "./routes/Login"
import Session from "./routes/Session"
import Game from "./routes/Game"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/session" element={<Session />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  )
}

export default App