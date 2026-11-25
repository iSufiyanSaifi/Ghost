import { ProfileCard } from "@/components/ghost/profile-card"

export default function ProfileCardDemo() {
  return (
    <div className="grid max-w-sm gap-3">
      <ProfileCard name="Sufiyan Jin" role="Customer · Gold" phone="+91 97850 12345" email="sufiyan@ghost.com" />
      <ProfileCard name="Imran Shaikh" role="Senior technician · Bay 3" phone="+91 91234 56780" />
    </div>
  )
}
