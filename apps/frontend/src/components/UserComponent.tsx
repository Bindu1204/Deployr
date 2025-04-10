import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { Button } from './ui/button'
export default function UserProfile() {
  return (
    <header>
      <SignedOut>
        <Button>
          <SignInButton />
        </Button>
        <Button variant={'secondary'}>
          <SignUpButton />
        </Button>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  )
}