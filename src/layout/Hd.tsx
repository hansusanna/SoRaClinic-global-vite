import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// JSON import
import navi from '@/db/navi.json';
import type { NaviItem } from '@/db/type/common';

type HdProps = { onOpenBooking?: () => void }

export default function Hd({ onOpenBooking }: HdProps) {
  const [open, setOpen] = useState(false);
  const items = (navi as NaviItem[]).filter((item) => item.display);

  const navLink = (to: string, label: string) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`
      }
      onClick={() => setOpen(false)}
    >
      {label}
    </NavLink>
  );

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold">SoRa Clinic</Link>

        {/* 데스크탑 네비 */}
        <nav className="hidden md:flex gap-1">
          {items.map((item) => navLink(item.path, item.label))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="default" onClick={onOpenBooking}>예약하기</Button>

          {/* 모바일 메뉴 */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">메뉴</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>메뉴</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1">
                {items.map((item) => navLink(item.path, item.label))}
                <Button
                  className="mt-3"
                  onClick={() => {
                    setOpen(false);
                    onOpenBooking?.();
                  }}
                >
                  예약하기
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
