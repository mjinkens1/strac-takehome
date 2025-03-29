import {
  UserCircleIcon,
  NewspaperIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";

export function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-[var(--color-card-border)] px-4 py-3 shadow-md">
      <div className="mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NewspaperIcon className="size-4" color="var(--gradient-start)" />
          <div className="text-lg font-semibold gradient-text">
            Strac Takehome
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex items-center gap-2 text-muted-foreground hover:text-[var(--foreground)] transition-colors">
              <UserCircleIcon
                className="size-5"
                color="var(--gradient-start)"
              />
              {(session?.user?.name || session?.user?.email) && (
                <span className="hidden sm:inline text-sm">
                  {session.user.name || session.user.email}
                </span>
              )}
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-[var(--card-bg)] border border-[var(--color-card-border)] shadow-lg focus:outline-none z-50">
              <div className="py-1">
                <MenuItem>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-red-500"
                  >
                    <div className="flex items-center gap-2">
                      Sign out
                      <ArrowRightStartOnRectangleIcon className="size-4" />
                    </div>
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </nav>
  );
}
