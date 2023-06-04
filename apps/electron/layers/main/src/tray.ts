import {
  app,
  Tray,
  Menu,
  MenuItemConstructorOptions,
  BrowserWindow,
} from 'electron';
import path from 'path';
import { debounce } from 'lodash';

import {
  internetStore,
  ADStore,
  domainStore,
  getInternetState,
  getADState,
  getDomainState,
} from '@store/store';

import { getCrossPlatformIcon } from '@utils/iconUtils';
import calculateTrayWindowPosition from '@utils/trayUtils';

let tray: Tray | null = null;
const isMacOS = process.platform === 'darwin';

const createTray = (mainWindow: BrowserWindow) => {
  tray = new Tray(
    getCrossPlatformIcon(
      path.join(__dirname, '../../../buildResources/robot-green')
    )
  );

  const { roundedXPosition, roundedYPosition } = calculateTrayWindowPosition(
    tray,
    mainWindow
  );

  mainWindow.setPosition(roundedXPosition, roundedYPosition, false);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
      return;
    }

    if (tray) mainWindow.show();
  });

  const buildMenuItems = (): (MenuItemConstructorOptions & {
    id?: string;
  })[] => [
    {
      id: 'internet',
      label: `Internet Connection`,
      icon: getInternetState().icon,
      sublabel: getInternetState().sublabel,
    },
    { type: 'separator' },
    {
      id: 'AD',
      label: isMacOS ? 'AD Connection' : `Azure AD Connection`,
      icon: getADState().icon,
      sublabel: getADState().sublabel,
    },
    { type: 'separator' },
    {
      id: 'domain',
      label: `Domain Connection`,
      icon: getDomainState().icon,
      sublabel: getDomainState().sublabel,
    },
  ];

  const updateMenu = debounce(() => {
    if (tray) {
      console.log('Updating tray menu...');
      const menu = Menu.buildFromTemplate(buildMenuItems());
      tray.setContextMenu(menu);
    }
  }, 300); // Adjust debounce time as needed

  updateMenu(); // Initial menu creation

  const unsubscribers = [
    internetStore.subscribe(() => {
      updateMenu();
    }),
    ADStore.subscribe(() => {
      updateMenu();
    }),
    domainStore.subscribe(() => {
      updateMenu();
    }),
  ];

  app.on('before-quit', () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    if (tray !== null) {
      tray.destroy();
      tray = null;
    }
  });

  return tray;
};

export default createTray;
