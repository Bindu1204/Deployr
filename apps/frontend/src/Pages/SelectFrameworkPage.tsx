import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SelectFrameworkPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // We define default values for state to prevent hooks from being conditionally called
  const { team = "", projectName = "", repo = "" } = location.state || {};

  // We need to make sure that useState hooks are called unconditionally
  const [framework, setFramework] = useState("Other");
  const [isDeploying, setIsDeploying] = useState(false);

  const frameworks = [
    "Other",
    "Angular",
    "Astro",
    "Blitz.js (Legacy)",
    "Brunch",
    "React",
    "HTML and CSS",
    "Javascript",
  ];

  // Effect to handle redirect if state is missing
  useEffect(() => {
    if (!team || !projectName || !repo) {
      navigate("/select-repo"); // Redirect to SelectRepo page if state is missing
    }
  }, [team, projectName, repo, navigate]); // run this only if any of these values change

  // If the state is missing, we prevent rendering by returning null
  if (!team || !projectName || !repo) {
    return null; // or a loading spinner if preferred
  }

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      alert(
        `🚀 Deployment successful for "${projectName}" with "${framework}" framework!`
      );
      setIsDeploying(false);
    }, 2000); // simulate a delay
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border rounded-md shadow-md space-y-4">
      <h1 className="text-xl font-bold">Select Framework for Deployment</h1>
      <p className="text-sm text-gray-600">{repo} → main</p>

      <div>
        <label className="block mb-1 font-medium">Vercel Team</label>
        <p>{team}</p>
      </div>

      <div>
        <label className="block mb-1 font-medium">Project Name</label>
        <p>{projectName}</p>
      </div>

      <div>
        <label className="block mb-1 font-medium">Select Framework</label>
        <select
          value={framework}
          onChange={(e) => setFramework(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {frameworks.map((f, idx) => (
            <option key={idx} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleDeploy}
          disabled={isDeploying || framework === "Other"}
          className={`${
            isDeploying ? "bg-gray-400" : "bg-blue-500"
          } text-white p-2 rounded`}
        >
          {isDeploying ? "Deploying..." : "Deploy"}
        </button>
      </div>
    </div>
  );
};

export default SelectFrameworkPage;
