import React from 'react';
import useLocalStorageState from 'useLocalStorageState';
import useInterval from 'useInterval';
import useHotKeys from 'useHotKeys';
import useDocumentTitle from 'useDocumentTitle';
import styled, { createGlobalStyle } from 'styled-components';
import media from 'mediaQueries';

const colorsDark = [
  '#ffffff',
  '#ff1744',
  '#d500f9',
  '#2d2ae5',
  '#18ffff',
  '#00e676',
  '#ffff4d',
  '#ffa033'
];

const colorsLight = [
  '#222222',
  '#ff0022',
  '#d500f9',
  '#2d2ae5',
  '#00d2d2',
  '#00cc69',
  '#e7d918',
  '#ff941a'
];

const getTimeBits = () => {
  const now = new Date();
  const hrs = now
    .getHours()
    .toString(2)
    .padStart(5, '0');
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

const getTimeText = () => {
  const now = new Date();
  return [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map(n => n.toString().padStart(2, '0'))
    .join(' : ');
};

const GlobalStyles = createGlobalStyle`
  body {
    background: ${p => (p.prefs.darkTheme ? '#222' : '#efefef')};
    margin: 0;
    padding: 0;
    color: ${p => p.colors[p.prefs.color]};
    font-family: Courier, Monaco, monospace;
  }
`;

const AppStyles = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  ${media.large`
    min-height: 65vh;
  `}
`;

const Time = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Labels = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem 0 1rem 0;
  opacity: ${p => (p.prefs.showLabels ? '1' : '0')};
  cursor: pointer;
  justify-content: center;
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
  background: ${p => p.colors[p.prefs.color]};
  opacity: ${p => (p.bit ? '1' : '0.2')};
  transform: scale(${p => (p.bit ? '1' : '0.25')});
  box-shadow: 0 0 5px ${p => p.colors[p.prefs.color]};
  margin: 1rem;
  transition: all 200ms;
  ${media.small`
    --size: 2rem;
    margin: 1.5rem;
  `}
  ${media.large`
    --size: 3rem;
    margin: 2rem;
  `}
`;

const Foot = styled.div`
  position: absolute;
  bottom: 8px;
  a {
    color: inherit;
    text-decoration: none;
  }
`;

function App() {
  const [[hrBits, minBits, secBits], setTime] = React.useState(getTimeBits());
  const [prefs, setPrefs] = useLocalStorageState('userPrefs', {
    showLabels: false,
    color: 0,
    darkTheme: true
  });
  const colors = prefs.darkTheme ? colorsDark : colorsLight;
  const timeLabel = getTimeText();

  const toggleLabels = () =>
    setPrefs(prev => ({ ...prev, showLabels: !prev.showLabels }));

  const toggleDarkTheme = () =>
    setPrefs(prev => ({ ...prev, darkTheme: !prev.darkTheme }));

  const cycleColor = () =>
    setPrefs(prev => ({ ...prev, color: (prev.color + 1) % colors.length }));

  useInterval(() => {
    setTime(getTimeBits());
  }, 200);

  useHotKeys({
    l: toggleLabels,
    d: toggleDarkTheme,
    c: cycleColor
  });

  useDocumentTitle(timeLabel);

  return (
    <AppStyles>
      <GlobalStyles prefs={prefs} colors={colors} />
      <Time>
        <Labels prefs={prefs} colors={colors} onClick={toggleLabels}>
          <div>32</div>
          <div>16</div>
          <div>8</div>
          <div>4</div>
          <div>2</div>
          <div>1</div>
        </Labels>
        <HourDisplay>
          {hrBits.map((bit, key) => (
            <Bit key={key} bit={!!bit} prefs={prefs} colors={colors} />
          ))}
        </HourDisplay>
        <MinDisplay>
          {minBits.map((bit, key) => (
            <Bit key={key} bit={!!bit} prefs={prefs} colors={colors} />
          ))}
        </MinDisplay>
        <SecDisplay>
          {secBits.map((bit, key) => (
            <Bit key={key} bit={!!bit} prefs={prefs} colors={colors} />
          ))}
        </SecDisplay>
        <Labels prefs={prefs} colors={colors} onClick={toggleLabels}>
          {timeLabel}
        </Labels>
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
