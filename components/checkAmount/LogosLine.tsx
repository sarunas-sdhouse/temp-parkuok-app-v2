import React from 'react';
import { View, StyleSheet } from 'react-native';
import Maestro from 'assets/payments/Maestro';
import Mastercard from 'assets/payments/Mastercard';
import MasterCardSecureCode from 'assets/payments/MastercardSecureCode';
import VerifiedByVisa from 'assets/payments/VerifiedByVisa';
import Visa from 'assets/payments/Visa';
import VisaElectron from 'assets/payments/VisaElectron';

const LogosLine = () => {
  return (
    <View style={styles.container}>
      <Maestro width={50} height={50}/>
      <Mastercard width={50} height={50}/>
      <Visa width={50} height={50}/>
      <VisaElectron width={50} height={50}/>
      <MasterCardSecureCode width={50} height={50}/>
      <VerifiedByVisa width={50} height={50}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-between'
  },
});

export default LogosLine;