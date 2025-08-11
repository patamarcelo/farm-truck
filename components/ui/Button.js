import React from "react";
import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { Colors } from "../../constants/styles";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Haptics from 'expo-haptics';

function Button({
    children,
    onPress,
    btnStyles,
    disabled = false,
    textStyles,
    hasIcon = false
}) {
    return (
        <Pressable
            disabled={disabled}
            onPressIn={() => console.log("PressIn")}
            onPressOut={() => console.log("PressOut")}
            onLongPress={() => console.log("LongPress")}
            style={({ pressed }) => [
                styles.button,
                btnStyles,
                pressed && styles.pressed,
                disabled && styles.disabledStyle
            ]}
            android_ripple={{ color: "rgba(255,255,255,0.2)" }}
            delayPressIn={0}
            onPress={(e) => {
                e.stopPropagation();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                console.log("Botão clicado ✅"); // teste visual no console
                if (onPress) onPress();
            }}
        >
            {hasIcon ? (
                <View style={styles.buttonContent}>
                    <Text style={[styles.buttonText, textStyles]}>{children}</Text>
                    <Icon
                        name="arrow-right"
                        size={20}
                        color={Colors.primary500}
                        style={styles.arrowIcon}
                    />
                </View>
            ) : (
                <Text style={[styles.buttonText, textStyles]}>{children}</Text>
            )}
        </Pressable>
    );
}

export default Button;

const styles = StyleSheet.create({
    buttonContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    disabledStyle: {
        opacity: 0.7
    },
    button: {
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: Colors.primary500,
        elevation: Platform.OS === "android" ? 3 : 0,
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    pressed: {
        opacity: Platform.OS === "ios" ? 0.7 : 1 // ripple já cuida no Android
    },
    buttonText: {
        textAlign: "center",
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 10
    }
});