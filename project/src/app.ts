import * as React from 'react';
import * as ReactNativeScript from 'react-nativescript';
import { MainScreen } from './components/MainScreen';

Object.defineProperty(global, '__DEV__', { value: false });

ReactNativeScript.start(React.createElement(MainScreen, {}, null));