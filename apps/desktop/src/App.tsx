import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Báo thức</h1>
        <p>Break Reminder Application</p>
        <p>Application is running in the system tray.</p>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </header>
    </div>
  );
}

export default App;

