import React from 'react';
import { Headline, Subheading } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import SignInForm from '../../components/auth/SignInForm';
import Screen from '../../components/common/Screen';

export default function SignInScreen({ navigation }: any) {
  return (
    <Screen safeArea style={{ justifyContent: 'space-between' }}>
      <SignInForm handleForgetPassword={() => navigation.navigate('ForgetPasswordScreen')} />
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Subheading style={{ textAlign: 'center', marginTop: 10 }}>
            Don't have and account? Sign Up
          </Subheading>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
