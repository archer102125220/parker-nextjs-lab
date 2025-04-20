'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { increment, setServerData } from '@/store/slices/systemSlice';

// This page only renders when the app is built statically (output: 'export')
export default function ReduxExample() {
  const dispatch = useAppDispatch();
  const { value, serverData } = useAppSelector((state) => state.system);

  // 模擬從伺服器獲取數據
  useEffect(() => {
    const fetchData = async () => {
      // 這裡可以是你的 API 調用
      const response = await fetch('/api/fake-data');
      const data = await response.json();
      dispatch(setServerData(data));
    };

    fetchData();
  }, [dispatch]);

  return (
    <main>
      <h1>Redux Example</h1>
      <div>
        <p>Counter: {value}</p>
        <button onClick={() => dispatch(increment())}>Increment</button>
      </div>
      <div>
        <h2>Server Data:</h2>
        <pre>{JSON.stringify(serverData, null, 2)}</pre>
      </div>
    </main>
  );
}
