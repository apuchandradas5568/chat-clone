import getCurrentUser from "@/app/actions/getCurrentUser";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

async function Sidebar({ children }: { children: React.ReactNode }) {

    const currentUser = await getCurrentUser()

  return (
    <div>
      <div className="h-full">
        {/* desktop sidebar will be here */}
        <DesktopSidebar currentUser = {currentUser!} />
        <MobileFooter />
        <main className="lg:pl-20 h-full "> {children} </main>
      </div>
    </div>
  );
}

export default Sidebar;
