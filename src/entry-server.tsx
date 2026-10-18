import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import ExtendedHome from './pages/ExtendedHome';
import Detail from './pages/Detail';
import Blog from './pages/Blog';
export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App pages={{ ExtendedHome, Detail, Blog }} />
    </StaticRouter>,
  );
}
