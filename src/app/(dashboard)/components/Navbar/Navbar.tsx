import { Logo } from "./components/Logo";
import { UserMenu } from "./components/UserMenu";

export function NavBar() {
  return (
    <nav className="border-b border-[var(--color-card-border)] px-4 py-3 shadow-md">
      <div className="mx-auto flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
