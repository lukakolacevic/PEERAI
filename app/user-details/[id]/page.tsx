import UserDetailsContent from "@/components/ui/user-details-content";

export default function UserDetails({ params }: { params: { id: string } }) {
  const userId = parseInt(params.id, 10);
  return <UserDetailsContent userId={userId} />;
}
