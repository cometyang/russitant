'use client';

import { MenuAlt2Icon, XIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React from 'react';

const MobileNavContext = React.createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export function MobileNavContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <MobileNavContext.Provider value={[isOpen, setIsOpen]}>
      {children}
    </MobileNavContext.Provider>
  );
}