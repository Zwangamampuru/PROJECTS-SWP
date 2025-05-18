import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
  Alert,
  Dimensions,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";

const CreditCardCheckout = () => {
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardColor, setCardColor] = useState("#A99156"); // Default card color
  const [errors, setErrors] = useState({
    cardNumber: false,
    cardHolder: false,
    expiry: false,
    cvv: false,
  });

  const flipAnim = new Animated.Value(0);

  const flipCard = () => {
    const toValue = isFlipped ? 0 : 1;
    Animated.timing(flipAnim, {
      toValue,
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const validateInputs = () => {
    const cardNumValid = /^4[0-9]{15}$/.test(cardNumber.replace(/\s/g, ""));
    const expiryValid = (() => {
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return false;
      const [month, year] = expiry.split("/").map(Number);
      const now = new Date();
      const expiryDate = new Date(2000 + year, month);
      const currentDate = new Date(now.getFullYear(), now.getMonth() + 1);
      return expiryDate >= currentDate;
    })();
    const cvvValid = /^\d{3}$/.test(cvv);
    const nameValid = cardHolder.trim().length > 0;

    const newErrors = {
      cardNumber: !cardNumValid,
      cardHolder: !nameValid,
      expiry: !expiryValid,
      cvv: !cvvValid,
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      setCardColor("red");
      Alert.alert("Invalid Details", "Please correct the highlighted fields.");
    } else {
      setCardColor("green");
      Alert.alert("Payment Successful", "Redirecting...");
      setTimeout(() => {
     //   router.replace("/BookingConfirmPage");
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: cardColor },
            { transform: [{ rotateY: frontInterpolate }] },
          ]}
        >
          <Text style={styles.cardText}>{cardNumber || "**** **** **** ****"}</Text>
          <Text style={styles.cardText}>{cardHolder || "Cardholder"}</Text>
          <Text style={styles.cardText}>{expiry || "MM/YY"}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            { backgroundColor: cardColor },
            { transform: [{ rotateY: backInterpolate }] },
          ]}
        >
          <Text style={styles.cardText}>CVV: {cvv || "***"}</Text>
        </Animated.View>
      </View>

      <TextInput
        style={[styles.input, errors.cardNumber && styles.errorInput]}
        placeholder="Card Number"
        keyboardType="numeric"
        maxLength={19}
        value={cardNumber}
        onChangeText={setCardNumber}
      />
      <TextInput
        style={[styles.input, errors.cardHolder && styles.errorInput]}
        placeholder="Cardholder Name"
        value={cardHolder}
        onChangeText={setCardHolder}
      />
      <TextInput
        style={[styles.input, errors.expiry && styles.errorInput]}
        placeholder="Expiry Date (MM/YY)"
        maxLength={5}
        value={expiry}
        onChangeText={setExpiry}
      />
      <TextInput
        style={[styles.input, errors.cvv && styles.errorInput]}
        placeholder="CVV"
        keyboardType="numeric"
        maxLength={3}
        secureTextEntry
        value={cvv}
        onChangeText={setCvv}
        onFocus={flipCard}
        onBlur={flipCard}
      />

      <Pressable style={styles.button} onPress={validateInputs}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: "#4CAF50", marginTop: 10 }]}
        onPress={() => Linking.openURL("https://www.onlinebanking.example.com")}
      >
        <Text style={styles.buttonText}>Pay via Bank App</Text>
      </Pressable>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  cardContainer: {
    marginBottom: 20,
    width: width * 0.9,
    height: 200,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
    position: "absolute",
    backfaceVisibility: "hidden",
  },
  cardBack: {
    transform: [{ rotateY: "180deg" }],
    backgroundColor: "#999",
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    width: "90%",
    height: 50,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 2,
  },
  button: {
    width: "90%",
    backgroundColor: "#A99156",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default CreditCardCheckout;
