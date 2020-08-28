import React, {useState, useContext} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {Title} from 'react-native-paper';
import {Icon} from 'react-native-elements';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import Loading from '../components/Loading';

const {width} = Dimensions.get('screen');
const authErrors = {
  NOT_FOUND: '[auth/user-not-found]',
  WRONG_PASSWORD: '[auth/wrong-password]',
};

export default function Login({navigation}) {
  const {login} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = () => {
    setLoading(true);
    login(email, password).catch((err) => {
      setLoading(false);
      const cause = err.message.substr(0, err.message.indexOf(']') + 1);
      let errorMsg = '';
      if (cause === authErrors.NOT_FOUND) {
        errorMsg = "Sorry, we couldn't find an account using this email";
      } else if (cause === authErrors.WRONG_PASSWORD) {
        errorMsg = "W'oops... Wrong password !";
      } else {
        errorMsg = 'Sorry, something went wrong';
        console.log(err.message.replace(cause + ' ', ''));
      }
      setError(errorMsg);
    });
  };

  const renderError = () => (
    <View style={styles.errorMsgContainer}>
      <Icon name="error" color="#fff" style={styles.errorIcon} />
      <Text style={styles.errorMsg}>{error}</Text>
    </View>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Title style={styles.titleText}>Welcome to Chat App</Title>

      {error && renderError()}

      <FormInput
        labelName="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={(userEmail) => setEmail(userEmail)}
      />
      <FormInput
        labelName="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={(userPassword) => setPassword(userPassword)}
      />
      <FormButton
        title="Login"
        modeValue="contained"
        labelStyle={styles.loginButtonLabel}
        disabled={email.trim().length === 0 || password.trim().length === 0}
        onPress={handleLogin}
      />
      <FormButton
        title="New user? Join here"
        modeValue="text"
        uppercase={false}
        labelStyle={styles.navButtonText}
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
  },
  errorMsgContainer: {
    width: width / 1.2,
    backgroundColor: '#F3514F',
    borderRadius: 3,
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  errorIcon: {
    flex: 1,
    marginRight: 10,
  },
  errorMsg: {
    flexWrap: 'wrap',
    color: '#fff',
    flex: 2,
  },
  loginButtonLabel: {
    fontSize: 22,
  },
  navButtonText: {
    fontSize: 12,
  },
});
