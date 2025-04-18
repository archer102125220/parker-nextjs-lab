import { Link } from '@/i18n/navigation';

export default function ComponentsPage() {
  return (
    <div>
      <h1>元件展示頁面</h1>
      <ul>
        <li>
          {/* 假設 Dialog 元件的展示頁路徑為 /components/dialog */}
          <Link href="/components/dialog">Dialog 元件</Link>
        </li>
        {/* 如果有其他元件，可以在這裡繼續添加連結 */}
      </ul>
    </div>
  );
}
