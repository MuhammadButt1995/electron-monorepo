/* eslint-disable arrow-body-style */
import path from 'path';
import { createStore } from 'zustand/vanilla';
import { subscribeWithSelector } from 'zustand/middleware';
import { nativeImage, NativeImage } from 'electron';
import { wasConnectedNowNotConnectedNotif } from '@storeHelpers/notifications';
import { updateIcon } from '@storeHelpers/updateIcon';
import { updateTrayStore, TrayIconState } from './tray-store';

export type ConnectionState =
  | 'connected'
  | 'not_connected'
  | 'error'
  | 'loading';

export type ConnectionStoreState = {
  connectionState: ConnectionState;
  icon: NativeImage;
  sublabel: string;
};

export type Message = Omit<ConnectionStoreState, 'icon'>;

export type ConnectionStoreActions = {
  updateConnectionState: (newState: Message) => void;
};

const createConnectionStore = () =>
  createStore(
    subscribeWithSelector<ConnectionStoreState & ConnectionStoreActions>(
      (set) => ({
        connectionState: 'loading',
        icon: nativeImage.createFromPath(
          path.join(__dirname, '../assets/loading.png')
        ),
        sublabel: '',
        updateConnectionState: (newState: Message) => {
          set(() => ({
            connectionState: newState.connectionState,
            icon: updateIcon(newState.connectionState),
            sublabel: newState.sublabel,
          }));
        },
      })
    )
  );

export const internetStore = createConnectionStore();
export const azureStore = createConnectionStore();
export const domainStore = createConnectionStore();

export const getInternetState = () => internetStore.getState();
export const getAzureState = () => azureStore.getState();
export const getDomainState = () => domainStore.getState();

export const checkAndUpdateIcon = () => {
  const internetState = getInternetState();
  const azureState = getAzureState();
  const domainState = getDomainState();

  let newIcon: TrayIconState = 'green';
  if (
    internetState.connectionState !== 'connected' ||
    azureState.connectionState !== 'connected' ||
    domainState.connectionState !== 'connected'
  ) {
    newIcon = 'yellow';
  }

  updateTrayStore(newIcon);
};

export const updateInternetStore = (newState: Message) => {
  internetStore.getState().updateConnectionState(newState);
  checkAndUpdateIcon();
};

export const updateAzureStore = (newState: Message) => {
  azureStore.getState().updateConnectionState(newState);
  checkAndUpdateIcon();
};

export const updateDomainStore = (newState: Message) => {
  domainStore.getState().updateConnectionState(newState);
  checkAndUpdateIcon();
};

// Notification Subscribers
export const notificationUnsubscribers = [
  internetStore.subscribe(
    (state) => state.connectionState,
    wasConnectedNowNotConnectedNotif({
      title: 'Internet Connection Lost',
      body: 'Your internet connection has been lost.',
      icon: nativeImage.createFromPath(
        path.join(__dirname, '../assets/wifi-off.ico')
      ),
    })
  ),
  azureStore.subscribe(
    (state) => state.connectionState,
    wasConnectedNowNotConnectedNotif({
      title: 'Azure Connection Lost',
      body: 'Your Azure connection has been lost.',
      icon: nativeImage.createFromPath(
        path.join(__dirname, '../assets/cloud.ico')
      ),
    })
  ),
  domainStore.subscribe(
    (state) => state.connectionState,
    wasConnectedNowNotConnectedNotif({
      title: 'Domain Connection Lost',
      body: 'Your domain connection has been lost.',
      icon: nativeImage.createFromPath(
        path.join(__dirname, '../assets/domain-off.ico')
      ),
    })
  ),
];