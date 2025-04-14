// pages/SelectRepo.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface Repository {
  id: number;
  name: string;
}

export default function SelectRepo() {
  const location = useLocation();
  const repositories: Repository[] = location.state?.repositories || [];

  const handleImport = (repoName: string) => {
    alert(`Repository "${repoName}" imported!`);
    // or redirect to another page, or send to backend
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-md shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4">Import Git Repository</h2>

      {repositories.length > 0 ? (
        <ul className="space-y-3">
          {repositories.map((repo) => (
            <li
              key={repo.id}
              className="flex items-center justify-between border p-3 rounded-md"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-600 w-4 h-4" />
                <span>{repo.name}</span>
              </div>
              <Button onClick={() => handleImport(repo.name)}>Import</Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No repositories found.</p>
      )}
    </div>
  );
}
