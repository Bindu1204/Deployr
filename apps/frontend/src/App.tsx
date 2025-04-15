import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserComponent from "./components/UserComponent";
import Landing from "./Pages/Landing";
import SelectFrameworkPage from "./Pages/SelectFrameworkPage"; // Ensure correct import path

const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-slate-950 h-screen w-screen">
        <UserComponent />
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/select-framework" element={<SelectFrameworkPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
