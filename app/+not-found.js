import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const NotFound = () => {
  const navigation = useNavigation();
  
  const handleSignUp = () => {
    navigation.navigate('SignupScreen'); 
  };

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Motalk!</Text>
      <Text style={styles.message}>Connect with your friends and family easily.</Text>
      <Button title="Get Started" onPress={handleSignUp} />
      
      <TouchableOpacity onPress={() => openLink("https://docs.google.com/document/d/1gyD1Ln0WU4bEGGrp1nLyGIy-aMCxiNzt/edit?usp=sharing&ouid=111932104666653978967&rtpof=true&sd=true")} accessible>
        <Text style={styles.link}>Application Terms of Service</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => openLink("https://docs.google.com/document/d/1hMwtg6h4pCRgAjY2z9XvqJ1e9qXJ0NK_/edit?usp=sharing&ouid=111932104666653978967&rtpof=true&sd=true")} accessible>
        <Text style={styles.link}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  link: {
    color: '#1E90FF', // Bright blue for links
    textDecorationLine: 'underline',
    marginVertical: 5,
  },
});

export default NotFound;
