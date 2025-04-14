import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserComponent from "./components/UserComponent";
import Landing from "./Pages/Landing";
import SelectRepo from "./Pages/SelectRepo"; // assuming this is your next page

export default function App() {
  return (
    <Router>
      <div className="bg-slate-950 h-screen w-screen">
        <UserComponent />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/select-repo" element={<SelectRepo />} />
        </Routes>
      </div>
    </Router>
  );
}
