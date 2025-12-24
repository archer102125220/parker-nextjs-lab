'use client';

import GoTop from '@/components/GoTop';

export default function GoTopClient() {
  return (
    <GoTop
      limit={100}
      position="fixed"
      right="25px"
      showBottom="25px"
      heddinBottom="-50px"
    />
  );
}
