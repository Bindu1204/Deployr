import UserComponent from "./components/UserComponent";
import Landing from "./Pages/Landing";

export default function App() {
  return (
    <div className="bg-slate-950 h-screen w-screen">
      <div>
        <div>
          <UserComponent/>
          <Landing/>
        </div>
      </div>
    </div>
  )
};