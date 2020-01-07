import React from 'react';
import useInterval from 'useInterval';
import useHotKeys from 'useHotKeys';
import styled, { createGlobalStyle } from 'styled-components';
import useDocumentTitle from 'useDocumentTitle';

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
  return [hrs, mins, secs].map(s => s.split('').map(b => (b === '1' ? 1 : 0)));
};

const GlobalStyles = createGlobalStyle`
  body {
    background: #333;
    margin: 0;
    padding: 0;
    color: white;
  }
`;

const AppStyles = styled.div`
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const Time = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  max-width: 50%;
`;

const Labels = styled.div`
  display: flex;
  width: 100%;
  font-family: Courier, Monaco, monospace;
  margin-bottom: 1rem;
  opacity: ${p => (p.show ? '0.2' : '0')};
  cursor: pointer;
  div {
    display: flex;
    flex: 1;
    justify-content: center;
  }
`;
const HourDisplay = styled.div``;
const MinDisplay = styled.div``;
const SecDisplay = styled.div``;

const Bit = styled.div`
  --size: 2rem;
  display: inline-block;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: white;
  opacity: ${p => (p.bit ? '1' : '0.2')};
  transform: scale(${p => (p.bit ? '1' : '0.25')});
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  margin: 1rem;
  transition: all 200ms;
`;

function App() {
  const [[hrs, mins, secs], setTime] = React.useState(getTimeBits());
  const [showLabels, setShowLabels] = React.useState(false);

  const toggleLabels = () => setShowLabels(!showLabels);

  useInterval(() => {
    setTime(getTimeBits());
  }, 200);

  useHotKeys({
    l: toggleLabels
  });

  useDocumentTitle(`${hrs.join('')} ${mins.join('')}`);

  return (
    <AppStyles>
      <GlobalStyles />
      <Time>
        <Labels show={showLabels} onClick={toggleLabels}>
          <div>32</div>
          <div>16</div>
          <div>8</div>
          <div>4</div>
          <div>2</div>
          <div>1</div>
        </Labels>
        <HourDisplay>
          {hrs.map((bit, key) => (
            <Bit key={key} bit={!!bit} />
          ))}
        </HourDisplay>
        <MinDisplay>
          {mins.map((bit, key) => (
            <Bit key={key} bit={!!bit} />
          ))}
        </MinDisplay>
        <SecDisplay>
          {secs.map((bit, key) => (
            <Bit key={key} bit={!!bit} />
          ))}
        </SecDisplay>
      </Time>
    </AppStyles>
  );
}

export default App;
