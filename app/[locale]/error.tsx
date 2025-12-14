'use client'; // Error boundaries must be Client Components
import { useMemo } from 'react';

import { Button } from '@mui/material';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const memoError = useMemo(
    function () {
      if (process.env.NODE_ENV === 'development') {
        console.error({ error });
        return error;
      }
      return null;
    },
    [error]
  );

  return (
    <section>
      <h2>Something went wrong!</h2>
      {memoError ? (
        <>
          <p>{memoError.name}</p>
          <p>{memoError.message}</p>
          <p>{memoError.stack}</p>
          <p>{memoError.digest}</p>
        </>
      ) : (
        ''
      )}
      <Button onClick={() => reset()}>Try again</Button>
    </section>
  );
}
