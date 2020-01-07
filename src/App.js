import React from 'react';
import useInterval from 'useInterval';

const getTimeBits = () => {
  const now = new Date();
  const hrs = now
    .getHours()
    .toString(2)
    .padStart(4, '0');
  const mins = now
    .getMinutes()
    .toString(2)
    .padStart(6, '0');
  const secs = now
    .getSeconds()
    .toString(2)
    .padStart(6, '0');
  return [hrs, mins, secs];
};

function App() {
  const [[hrs, mins, secs], setTime] = React.useState(getTimeBits());

  useInterval(() => {
    setTime(getTimeBits());
  }, 200);

  return (
    <div className="App">
      {hrs}:{mins}:{secs}
    </div>
  );
}

export default App;
