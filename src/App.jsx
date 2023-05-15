import { Route, Routes } from "react-router-dom"
import LoginRegister from "./routes/LoginRegister"
import Session from "./routes/Session"
import Game from "./routes/Game"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginRegister text={"Login"} />} />
      <Route path="/register" element={<LoginRegister text={"Register"} />} />
      <Route path="/session" element={<Session />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  )
}

export default App