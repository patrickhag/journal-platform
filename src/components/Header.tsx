import { HeaderElement } from './HeaderElement';

export default function Header() {
  return (
    <header className="border-b bg-white sticky h-16 top-0 z-50">
      <div className="flex items-center justify-between h-full mx-3">
        <HeaderElement />
      </div>
    </header>
  );
}
