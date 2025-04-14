import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";

export default function UserProfile() {
  return (
    <header className="flex items-center gap-4 p-4">
      <SignedOut>
        <Button asChild>
          <SignInButton />
        </Button>
        <Button variant="secondary" asChild>
          <SignUpButton />
        </Button>
      </SignedOut>

      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </header>
  );
}
