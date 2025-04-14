import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react"; // Import Clerk's useUser hook

// Define interface for the repository object
interface Repository {
  id: number;
  name: string;
}

export default function Landing() {
  const [accessOption, setAccessOption] = useState("all");
  const [repositories, setRepositories] = useState<Repository[]>([]); // State to hold repositories, typed as Repository[]
  const { user, isLoaded, isSignedIn } = useUser(); // Retrieve current user

  // Log user data to debug and check available properties
  useEffect(() => {
    console.log(user);
    console.log(repositories);
     // Log user to inspect its structure
  }, [user,repositories]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Loading state while user data is being fetched
  }

  if (!isSignedIn) {
    return <div>Please sign in to continue.</div>; // Display message if the user is not signed in
  }

  // Use a fallback if no name is found
  const userName = user?.firstName || user?.username || "User";

  // Fetch repositories when "Install" button is clicked
  const fetchRepositories = async () => {
    try {
      // Dummy API call (replace with actual API or service)
      const response = await fetch(`https://api.github.com/users/${user.username}/repos`);
      const data = await response.json();
      setRepositories(data); // Set the repositories to state
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-md shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4">
        Install on your personal account <span className="font-bold">{userName}</span>
      </h2> 
      <div className="mb-6">
        <p className="font-medium mb-2">for these repositories:</p>
        <div className="space-y-3">
          <label className="flex items-start gap-2 cursor-pointer">
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
          <label className="flex items-start gap-2 cursor-pointer">
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

      <div className="mb-6">
        <p className="font-medium mb-2">with these permissions:</p>
        <ul className="space-y-1 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600 w-4 h-4" /> Read access to metadata
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600 w-4 h-4" />
            Read and write access to administration, checks, code, commits, deployments, issues, pull requests, and hooks
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <p className="font-medium mb-2">User permissions</p>
        <p className="text-sm text-gray-700 mb-2">
          Vercel can also request users' permission to the following resources:
        </p>
        <ul className="space-y-1 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600 w-4 h-4" /> Read access to email addresses
          </li>
        </ul>
      </div>

      {/* Button to fetch repositories */}
      <div className="flex justify-end">
        <Button onClick={fetchRepositories}>Install</Button>
      </div>

      {/* Display repositories once fetched */}
      {repositories.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium text-lg">Your Repositories:</h3>
          <ul className="space-y-2 mt-3">
            {repositories.map((repo) => (
              <li key={repo.id} className="flex items-center gap-2">
                <CheckCircle2 className="text-green-600 w-4 h-4" />
                <span>{repo.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}