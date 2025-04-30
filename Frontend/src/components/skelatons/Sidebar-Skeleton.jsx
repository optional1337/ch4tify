import { Users as GroupIcon, UserPlus, Search } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-65 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
      <div className="flex items-center justify-between gap-3">
  {/* 🔍 Search Bar with Icon */}
        <div className="flex items-center gap-2 border border-base-300 rounded-md px-2 py-1 w-full max-w-[200px]">
          <Search className="size-4 text-zinc-500 -scale-x-100" />
          <input
            type="text"
            placeholder="Search chats"
            className="bg-transparent outline-none text-sm w-full placeholder:text-zinc-400"
          />
        </div>

        {/* ➕ Add User & Add Group Icons */}
        <div className="flex items-center gap-3">
          <button title="Add User" className="hover:text-primary/80">
            <UserPlus className="size-5" />
          </button>
          <button title="Add Group" className="hover:text-primary/80">
            <GroupIcon className="size-5" />
          </button>
        </div>
      </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative">
              <div className="skeleton size-12 rounded-full" />
            </div>

            {/* User info skeleton */}
            <div className="text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
