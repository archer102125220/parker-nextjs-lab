import { usePathname, useRouter } from 'next/navigation';

import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return ['/', '/zh-tw', '/en'].includes(pathname) === false ? (
    <IconButton color="primary" onClick={handleBack}>
      <ArrowBackIcon />
    </IconButton>
  ) : (
    ''
  );
}
