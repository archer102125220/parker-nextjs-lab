'use client';
import type { ReactNode } from 'react';

import type { FirebaseMessaging } from '@/models/firebasemessaging';

type CloudMessagingDataTableProps = {
  tokenList: FirebaseMessaging[];
};

function CloudMessagingDataTable(
  props: CloudMessagingDataTableProps
): ReactNode {
  const { tokenList } = props;
  return <div>{JSON.stringify(tokenList)}</div>;
}

export default CloudMessagingDataTable;
