import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { useFonts, Roboto_400Regular } from "@expo-google-fonts/roboto";

const BACKGROUND_COLOR = "#0A0A0A";
const ERROR_COLOR = "#808080";
const PRIMARY_COLOR = "#FA7FD6";

const PIN_LENGTH = 4;
const CORRECT_PIN = "1234";
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 60;

const LockScreen = () => {
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(LOCKOUT_TIME);

  useEffect(() => {
    if (locked && lockoutTimer > 0) {
      const timer = setInterval(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (locked && lockoutTimer === 0) {
      resetState();
    }
  }, [locked, lockoutTimer]);

  const handleKeyPress = (value: string) => {
    if (locked) return;
    if (pin.length < PIN_LENGTH) {
      setPin((prev) => prev + value);
    }
  };

  const handlePinSubmit = () => {
    if (pin === CORRECT_PIN) {
      Alert.alert("Unlocked", "", [{ text: "OK", onPress: resetState }]);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(`You have ${MAX_ATTEMPTS - newAttempts} attempts left`);
      if (newAttempts >= MAX_ATTEMPTS) {
        setLocked(true);
        setError("Keypad Locked");
        setLockoutTimer(LOCKOUT_TIME);
      } else {
        setPin("");
      }
    }
  };

  const resetState = () => {
    setPin("");
    setAttempts(0);
    setError("");
    setLocked(false);
    setLockoutTimer(LOCKOUT_TIME);
  };

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handlePinSubmit();
    }
  }, [pin]);

  const renderKey = ({ item }: { item: string }) => (
    <RoundedButton
      item={item}
      locked={locked}
      handleKeyPress={handleKeyPress}
    />
  );

  const keyData = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "DEL"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Passcode</Text>
      <View style={styles.pinCircles}>
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.pinCircle,
              index < pin.length && {
                backgroundColor: PRIMARY_COLOR,
              },
            ]}
          />
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {locked ? (
        <Text style={styles.timerText}>
          {`Locked for ${lockoutTimer} seconds`}
        </Text>
      ) : (
        <FlatList
          data={keyData}
          renderItem={renderKey}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          style={styles.keypad}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  title: {
    fontSize: 24,
    marginTop: 50,
    marginBottom: 30,
    color: PRIMARY_COLOR,
    fontFamily: "Roboto_400Regular",
  },
  errorText: {
    color: ERROR_COLOR,
    fontFamily: "Roboto_400Regular",
  },
  pinCircles: {
    flexDirection: "row",
    marginBottom: 20,
  },
  pinCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    marginHorizontal: 8,
  },
  keypad: {
    width: "80%",
    height: "50%",
    marginTop: 30,
  },
  key: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
  keyText: {
    fontSize: 24,
    color: PRIMARY_COLOR,
    fontFamily: "Roboto_400Regular",
  },
  lockedKeyText: {
    color: "grey",
  },
  timerText: {
    fontSize: 18,
    color: ERROR_COLOR,
    marginTop: 20,
    fontFamily: "Roboto_400Regular",
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 30,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Roboto_400Regular",
  },
  emptyButton: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
    borderColor: "transparent",
  },
});

const RoundedButton = ({
  item,
  locked,
  handleKeyPress,
}: {
  item: string;
  locked: boolean;
  handleKeyPress: (item: string) => void;
}) => {
  if (item === "") {
    return <View style={styles.emptyButton} />;
  }
  return (
    <TouchableOpacity
      style={styles.key}
      onPress={() => handleKeyPress(item)}
      disabled={locked} // Removed the specific item check
    >
      {item ? <Text style={styles.keyText}>{item}</Text> : null}
    </TouchableOpacity>
  );
};

export default function Index() {
  return <LockScreen />;
}
