import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ImageBackground,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: false, password: false });
  const [token, setToken] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    //expoClientId: "306014032949-bmbp6unhsi688bmqr2sl2m27hp90d8v4",
    iosClientId: "306014032949-bmbp6unhsi688bmqr2sl2m27hp90d8v4.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "306014032949-bmbp6unhsi688bmqr2sl2m27hp90d8v4.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.authentication?.accessToken ?? null);
      Alert.alert("Google Login Successful", "Access Token Received");
    }
  }, [response]);

  const validate = () => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordValid = password.length >= 6;

    setErrors({
      email: !emailValid,
      password: !passwordValid,
    });

    if (emailValid && passwordValid) {
      Alert.alert("Success", isSignUp ? "Signed Up" : "Logged In");
    } else {
      Alert.alert("Error", "Please correct the highlighted fields.");
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://picsum.photos/900" }}
      style={styles.background}
      blurRadius={10}
    >
      <View style={styles.glassBox}>
        <Text style={styles.title}>{isSignUp ? "Sign Up" : "Login"}</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#ddd"
          style={[
            styles.input,
            errors.email && styles.errorInput,
            !errors.email && email && styles.successInput,
          ]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ddd"
          style={[
            styles.input,
            errors.password && styles.errorInput,
            !errors.password && password && styles.successInput,
          ]}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={validate}>
          <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Login"}</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: "#DB4437" }]}
          disabled={!request}
          onPress={() => promptAsync()}
        >
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </Pressable>

        <Pressable onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.link}>
            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  glassBox: {
    margin: 20,
    padding: 25,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#fff",
  },
  errorInput: {
    borderColor: "red",
  },
  successInput: {
    borderColor: "green",
  },
  button: {
    backgroundColor: "#6C63FF",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#ddd",
  },
});

export default AuthScreen;
