// import ReactDOM from 'react-dom/client'
import { createRoot } from '@bbkit/sys-ui-web';
import RUI from '@bbkit/sys-ui-web/rui';
import UI from '@bbkit/sys-ui-web/ui';
import Controller from './controller-react';

const { React } = RUI;
const { Label } = UI;

const webRoot = createRoot(document.getElementById('root')!);
webRoot.mount().then(() => {
  webRoot.render(
    <React.StrictMode>
      <Controller />
    </React.StrictMode>
  );
});
