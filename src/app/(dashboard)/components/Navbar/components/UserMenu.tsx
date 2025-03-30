import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ArrowRightStartOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';

export function UserMenu() {
  const { data: session } = useSession();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="text-muted-foreground inline-flex items-center gap-2 transition-colors hover:text-[var(--foreground)]">
        <UserCircleIcon className="size-5" color="var(--gradient-start)" />
        {(session?.user?.name || session?.user?.email) && (
          <span className="hidden text-sm sm:inline">
            {session.user.name || session.user.email}
          </span>
        )}
      </MenuButton>
      <MenuItems className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md border border-[var(--color-card-border)] bg-white shadow-lg focus:outline-none dark:bg-[var(--card-bg)]">
        <div className="py-1">
          <MenuItem>
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2 text-left text-sm text-red-500"
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
  );
}
