/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { ARContextProvider } from './Context/ARContext';

const MainApp = () => (
  <ARContextProvider>
    <App />
  </ARContextProvider>
);

AppRegistry.registerComponent(appName, () => MainApp);
