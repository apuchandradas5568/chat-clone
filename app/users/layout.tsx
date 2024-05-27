import Sidebar from "../components/sidebar/Sidebar";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* @ts-expect-error Server Component */}
      <Sidebar />

      <div className="h-full">{children}</div>
    </div>
  );
}
