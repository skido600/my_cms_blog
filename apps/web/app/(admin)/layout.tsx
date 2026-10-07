import Sidebar from "./authorized/_component/Sidebar";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <> */}
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="fixed md:relative  left-0 top-0 h-screen z-50">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1  md:ml-64">
          <main className="p-4 md:p-6  bg-[#FBFBFB] border-r  dark:border-neutral-500 dark:bg-[#1b1b1b]  min-h-screen">
            {children}
          </main>
        </div>
      </div>
      {/* </> */}
    </>
  );
}

export default AdminLayout;
