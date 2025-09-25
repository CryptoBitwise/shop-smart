import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onAnimationComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const logoRotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(logoRotate, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
        ]).start();

        // Complete animation after 2.5 seconds
        const timer = setTimeout(() => {
            onAnimationComplete();
        }, 2500);

        return () => clearTimeout(timer);
    }, [onAnimationComplete]);

    const logoRotation = logoRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

            {/* Background gradient effect */}
            <View style={styles.backgroundGradient} />

            {/* Animated logo container */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            { translateY: slideAnim },
                        ],
                    },
                ]}
            >
                {/* Shopping cart icon with rotation */}
                <Animated.View
                    style={[
                        styles.cartIcon,
                        {
                            transform: [{ rotate: logoRotation }],
                        },
                    ]}
                >
                    <Text style={styles.cartEmoji}>🛒</Text>
                </Animated.View>

                {/* App name */}
                <Text style={styles.appName}>ShopSmart</Text>
                <Text style={styles.tagline}>Smart Shopping Made Simple</Text>
            </Animated.View>

            {/* Loading indicator */}
            <Animated.View
                style={[
                    styles.loadingContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <View style={styles.loadingDots}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#3B82F6',
        // Add subtle gradient effect
        opacity: 0.9,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 16,
    },
    cartEmoji: {
        fontSize: 60,
    },
    appName: {
        fontSize: 36,
        fontWeight: '800',
        color: 'white',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        fontWeight: '300',
        letterSpacing: 0.5,
    },
    loadingContainer: {
        position: 'absolute',
        bottom: 100,
        alignItems: 'center',
    },
    loadingDots: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        marginHorizontal: 4,
    },
    dot1: {
        animationDelay: '0s',
    },
    dot2: {
        animationDelay: '0.2s',
    },
    dot3: {
        animationDelay: '0.4s',
    },
});

export default SplashScreen;
