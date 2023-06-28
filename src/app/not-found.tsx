'use client'

import { Boundary } from '@/component/Boundary';

const NotFound = () => (
  <Boundary labels={['not-found.tsx']} color="pink">
    <div className="space-y-4 text-vercel-pink">
      <h2 className="text-lg font-bold">Not Found</h2>

      <p className="text-sm">Could not find requested resource</p>
    </div>
  </Boundary>
);

export default NotFound;