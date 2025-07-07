import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { Button, Container, LanguageSelector } from '@/components/ui';
import { Colors, Spacing, Typography } from '@/constants/Theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('fr');

  const handleGetStarted = () => {
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const texts = {
    fr: {
      title: 'Missing Alert',
      slogan: 'Ensemble, retrouvons nos proches',
      subtitle: 'Une communauté mobilisée pour retrouver les personnes disparues',
      getStarted: 'Commencer',
      alreadyHaveAccount: "J'ai déjà un compte",
    },
    en: {
      title: 'Missing Alert',
      slogan: 'Together, let\'s find our loved ones',
      subtitle: 'A mobilized community to find missing persons',
      getStarted: 'Get Started',
      alreadyHaveAccount: 'I already have an account',
    },
  };

  const currentTexts = texts[selectedLanguage as keyof typeof texts];

  return (
    <Container safeArea={false} style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Language selector */}
      <View style={styles.languageContainer}>
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo placeholder - you can replace with actual logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🔍</Text>
          </View>
        </View>

        {/* Title and slogan */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentTexts.title}</Text>
          <Text style={styles.slogan}>{currentTexts.slogan}</Text>
          <Text style={styles.subtitle}>{currentTexts.subtitle}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={currentTexts.getStarted}
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}
          />

          <Button
            title={currentTexts.alreadyHaveAccount}
            onPress={handleLogin}
            variant="outline"
            size="large"
            style={styles.secondaryButton}
            textStyle={styles.secondaryButtonText}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {selectedLanguage === 'fr' 
            ? 'Votre sécurité et confidentialité sont notre priorité'
            : 'Your safety and privacy are our priority'
          }
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 0,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    opacity: 0.95,
  },
  languageContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  logoContainer: {
    marginBottom: Spacing['5xl'],
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing['5xl'],
  },
  title: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  slogan: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    opacity: 0.9,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: Typography.lineHeight.relaxed * Typography.base,
    paddingHorizontal: Spacing.lg,
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.lg,
  },
  primaryButton: {
    backgroundColor: Colors.white,
  },
  primaryButtonText: {
    color: Colors.primary,
  },
  secondaryButton: {
    borderColor: Colors.white,
  },
  secondaryButtonText: {
    color: Colors.white,
  },
  footer: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['2xl'],
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.sm,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.7,
  },
});
