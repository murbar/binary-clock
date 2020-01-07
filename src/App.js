import React from 'react';
import useInterval from 'useInterval';
import useHotKeys from 'useHotKeys';
import useDocumentTitle from 'useDocumentTitle';
import styled, { createGlobalStyle } from 'styled-components';
import media from 'mediaQueries';

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
    font-family: Courier, Monaco, monospace;
  }
`;

const AppStyles = styled.div`
  background: #333;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 55vh;
`;

const Time = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Labels = styled.div`
  display: flex;
  width: 100%;
  margin: 1rem 0 1rem 0;
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
  --size: 1rem;
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
  ${media.phone`
    --size: 2rem;
  `}
`;

const Foot = styled.div`
  position: absolute;
  bottom: 8px;
  a {
    color: rgba(255, 255, 255, 0.2);
    text-decoration: none;
  }
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
      <Foot>
        <a href="https://github.com/murbar/binary-clock" title="See the code on GitHub">
          &lt;/&gt;
        </a>
      </Foot>
    </AppStyles>
  );
}

export default App;
