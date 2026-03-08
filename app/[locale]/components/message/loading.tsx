import { Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <section>
      <Skeleton variant="text" width={300} height={60} />
      <Skeleton variant="rectangular" width="100%" height={400} />
    </section>
  );
}
