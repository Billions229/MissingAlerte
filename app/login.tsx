import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { Container, Button, PhoneInput } from '@/components/ui';
import { Colors, Typography, Spacing } from '@/constants/Theme';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhoneNumber = (phone: string): boolean => {
    // Basic phone number validation
    const phoneRegex = /^[0-9]{8,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSendCode = async () => {
    setError('');
    
    if (!phoneNumber.trim()) {
      setError('Veuillez saisir votre numéro de téléphone');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Veuillez saisir un numéro de téléphone valide');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to OTP verification screen (to be implemented)
      Alert.alert(
        'Code envoyé',
        `Un code de vérification a été envoyé au ${selectedCountry?.dialCode || '+229'} ${phoneNumber}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // router.push('/verify-otp');
              console.log('Navigate to OTP verification');
            },
          },
        ]
      );
    } catch (err) {
      setError('Erreur lors de l\'envoi du code. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    // Navigate to registration screen (to be implemented)
    Alert.alert('Information', 'L\'inscription sera disponible prochainement');
  };

  const handleGoogleLogin = () => {
    // Implement Google login
    Alert.alert('Information', 'Connexion Google sera disponible prochainement');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Container safeArea style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.gray700} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Connexion</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title and subtitle */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Bienvenue</Text>
            <Text style={styles.subtitle}>
              Connectez-vous pour accéder à votre compte Missing Alert
            </Text>
          </View>

          {/* Phone input */}
          <View style={styles.formContainer}>
            <PhoneInput
              label="Numéro de téléphone"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              onChangeCountry={setSelectedCountry}
              placeholder="Saisissez votre numéro"
              error={error}
              containerStyle={styles.phoneInputContainer}
            />

            {/* Send code button */}
            <Button
              title="Envoyer le code"
              onPress={handleSendCode}
              variant="primary"
              size="large"
              loading={loading}
              disabled={!phoneNumber.trim()}
              style={styles.sendCodeButton}
            />

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google login button */}
            <Button
              title="Continuer avec Google"
              onPress={handleGoogleLogin}
              variant="outline"
              size="large"
              style={styles.googleButton}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Vous n'avez pas de compte ?{' '}
          </Text>
          <TouchableOpacity onPress={handleCreateAccount}>
            <Text style={styles.footerLink}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  titleContainer: {
    marginBottom: Spacing['4xl'],
  },
  title: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.base,
  },
  formContainer: {
    flex: 1,
  },
  phoneInputContainer: {
    marginBottom: Spacing['2xl'],
  },
  sendCodeButton: {
    marginBottom: Spacing['2xl'],
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray200,
  },
  dividerText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.lg,
  },
  googleButton: {
    marginBottom: Spacing['2xl'],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['2xl'],
  },
  footerText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontSize: Typography.base,
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },
});
