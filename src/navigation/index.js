import React from 'react';
import {Provider as PagerProvider} from 'react-native-paper';
import {AuthProvider} from './AuthProvider';
import Routes from './Routes';

/**
 * Wrap all providers here
 */

export default function Providers() {
  return (
    <PagerProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </PagerProvider>
  );
}
