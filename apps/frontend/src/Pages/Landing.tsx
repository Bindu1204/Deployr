import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

interface Repository {
  id: number;
  name: string;
}

export default function Landing() {
  const [accessOption, setAccessOption] = useState("all");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<number[]>([]);
  const [projectName, setProjectName] = useState("");
  const [team, setTeam] = useState("");

  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.username) {
      const fetchRepositories = async () => {
        try {
          const response = await fetch(`https://api.github.com/users/${user.username}/repos`);
          const data = await response.json();
          setRepositories(data);
        } catch (error) {
          console.error("Error fetching repositories:", error);
        }
      };
      fetchRepositories();
    }
  }, [user]);

  const handleInstall = () => {
    const selectedRepoNames = repositories
      .filter((repo) => accessOption === "all" || selectedRepos.includes(repo.id))
      .map((repo) => repo.name);

    if (!projectName || !team) {
      alert("Please enter both Project Name and Team.");
      return;
    }

    navigate("/select-framework", {
      state: {
        repos: selectedRepoNames,
        team,
        projectName,
        repo: selectedRepoNames[0],
      },
    });
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Please sign in to continue.</div>;

  const userName = user?.firstName || user?.username || "User";

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded-md shadow-md bg-white space-y-6">
      <h2 className="text-xl font-semibold">
        Install on your personal account <span className="font-bold">{userName}</span>
      </h2>

      {/* Repo Access Options */}
      <div>
        <p className="font-medium mb-2">for these repositories:</p>
        <div className="space-y-4">
          <label className="flex gap-2 cursor-pointer">
            <input
              type="radio"
              name="repo-access"
              value="all"
              checked={accessOption === "all"}
              onChange={() => setAccessOption("all")}
              className="mt-1"
            />
            <div>
              <p className="font-medium">All repositories</p>
              <p className="text-sm text-gray-600">
                Applies to all current and future repositories owned by you. Also includes public repositories (read-only).
              </p>
            </div>
          </label>

          <label className="flex gap-2 cursor-pointer">
            <input
              type="radio"
              name="repo-access"
              value="select"
              checked={accessOption === "select"}
              onChange={() => setAccessOption("select")}
              className="mt-1"
            />
            <div>
              <p className="font-medium">Only select repositories</p>
              <p className="text-sm text-gray-600">
                Select at least one repository. Also includes public repositories (read-only).
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Repo Selector */}
      {accessOption === "select" && (
        <div className="mt-4 border rounded p-4 bg-gray-50">
          <label htmlFor="repo-select" className="block font-medium mb-2">
            Choose a repository from dropdown:
          </label>
          <select
            id="repo-select"
            onChange={(e) => {
              const selectedId = parseInt(e.target.value);
              if (!isNaN(selectedId)) {
                setSelectedRepos([selectedId]);
              }
            }}
            value={selectedRepos[0] || ""}
            className="w-full p-2 border rounded-md"
          >
            <option value="" disabled>
              -- Select a repository --
            </option>
            {repositories.map((repo) => (
              <option key={repo.id} value={repo.id}>
                {repo.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Project and Team Info */}
      <div className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block font-medium mb-1">
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter your project name"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="team" className="block font-medium mb-1">
            Team Name
          </label>
          <input
            id="team"
            type="text"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            placeholder="Enter your team name"
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      {/* Permissions Info */}
      <div>
        <p className="font-medium mb-2">with these permissions:</p>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600 w-4 h-4" />
            Read access to metadata
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600 w-4 h-4" />
            Read/write access to administration, checks, code, issues, PRs, hooks, etc.
          </li>
        </ul>
      </div>

      {/* Install Button */}
      {(accessOption === "all" || selectedRepos.length > 0) && (
        <div className="mt-4 p-4 bg-white border rounded-md shadow-sm flex items-center justify-between">
          <div>
            <p className="font-semibold">
              {accessOption === "all"
                ? "All repositories"
                : repositories.find((r) => r.id === selectedRepos[0])?.name}
            </p>
            <p className="text-sm text-gray-500">Ready to import</p>
          </div>
          <Button onClick={handleInstall}>Import</Button>
        </div>
      )}
    </div>
  );
}
