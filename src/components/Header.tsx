import { HeaderElement } from './HeaderElement';
import HeaderToggleButton from './HeaderToggleButton';

export default function Header() {
  return (
    <header className="border-b bg-white sticky h-16 top-0 z-50">
      <div className="flex items-center h-full mx-3">
        <div className="flex items-center gap-3">
          <HeaderToggleButton />
        </div>
        <div className="flex items-center justify-between flex-1">
          <HeaderElement />
        </div>
      </div>
    </header>
  );
}
