import type { ReactNode } from 'react';
import type { Thing, WithContext, Graph } from 'schema-dts';

interface JsonLdProps<T extends Thing> {
  data: WithContext<T> | Graph;
}

export default function JsonLd<T extends Thing>({ data }: JsonLdProps<T>): ReactNode {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
