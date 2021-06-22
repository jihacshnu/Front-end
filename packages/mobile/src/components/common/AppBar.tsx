import React, { useState } from 'react';
import { Appbar, Menu, TouchableRipple, Switch } from 'react-native-paper';
import { useHandleLogout } from '@frontend/shared/hooks/auth';

// interface IProps {
//   navigation: any;
//   previous: any;
//   authenticated?: boolean;
// }

export default function AppBar({ navigation, previous, authenticated = false }: any) {
  const { handleLogout } = useHandleLogout();
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Appbar.Header>
      {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      {/* <TouchableRipple onPress={() => {}}>
        <Switch
          // style={[{ backgroundColor: theme.colors.accent }]}
          color={'red'}
          value={true}
        />
      </TouchableRipple> */}
      {authenticated && !previous && (
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
      )}
      <Appbar.Content title="Drreamz" style={{ alignItems: 'center' }} />
      {authenticated && !previous ? (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="account-circle" color="white" onPress={openMenu} />}>
          <Menu.Item onPress={() => {}} title="Profile" disabled />
          <Menu.Item onPress={handleLogout} title="Logout" />
        </Menu>
      ) : null}
    </Appbar.Header>
  );
}
