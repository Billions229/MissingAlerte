import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Button, Container, OTPInput, Timer } from '@/components/ui';
import { Colors, Spacing, Typography } from '@/constants/Theme';
import { UserType } from '@/lib/supabase';

export default function VerifyOTPScreen() {
  const params = useLocalSearchParams();
  const phoneNumber = params.phoneNumber as string || '+229 ****1234';
  const isNewUser = params.isNewUser === 'true';
  const fullName = params.fullName as string || '';
  const userType = (params.userType as UserType) || 'family';
  
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const TIMER_DURATION = 60; // 60 seconds

  const maskPhoneNumber = (phone: string): string => {
    // Extract country code and last 4 digits
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length < 8) return phone;
    
    const countryCode = cleaned.substring(0, 4); // e.g., "+229"
    const lastFour = cleaned.slice(-4);
    const masked = `${countryCode} ****${lastFour}`;
    return masked;
  };

  const handleOTPChange = (code: string) => {
    setOtpCode(code);
  };

  const handleOTPComplete = (code: string) => {
    // Auto-verify when all digits are entered
    if (code.length === 6) {
      handleVerifyCode();
    }
  };

  const handleVerifyCode = async () => {
    if (otpCode.length !== 6) {
      Alert.alert('Erreur', 'Veuillez saisir le code à 6 chiffres');
      return;
    }

    setLoading(true);

    try {
      // Import authService dynamically to avoid IDE auto-removal
      const { authService } = await import('@/services/auth');

      // Verify OTP with Supabase
      const result = await authService.verifyOTP({
        phoneNumber: phoneNumber.replace(/\s/g, ''),
        token: otpCode,
      });

      if (!result.success) {
        Alert.alert('Erreur', result.error || 'Code de vérification invalide');
        return;
      }

      // Get the authenticated user
      const user = await authService.getCurrentUser();
      if (!user) {
        Alert.alert('Erreur', 'Impossible de récupérer les informations utilisateur');
        return;
      }

      if (isNewUser) {
        // Create profile for new user
        const profileResult = await authService.createProfile({
          userId: user.id,
          phoneNumber: phoneNumber.replace(/\s/g, ''),
          fullName: fullName,
          userType: userType,
        });

        if (!profileResult.success) {
          Alert.alert('Erreur', 'Impossible de créer le profil utilisateur');
          return;
        }

        Alert.alert(
          'Compte créé avec succès',
          'Votre compte a été créé et vérifié avec succès',
          [
            {
              text: 'Continuer',
              onPress: () => {
                // Navigate to main app for new users
                router.replace('/(tabs)');
              },
            },
          ]
        );
      } else {
        // Check if existing user has completed profile
        const hasProfile = await authService.hasCompletedProfile(user.id);

        Alert.alert(
          'Connexion réussie',
          'Vous êtes maintenant connecté',
          [
            {
              text: 'Continuer',
              onPress: () => {
                if (hasProfile) {
                  // Navigate to main app for existing users
                  router.replace('/(tabs)');
                } else {
                  // Navigate to profile setup if profile incomplete
                  router.replace('/profile-setup');
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la vérification. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setCanResend(false);
    setOtpCode('');

    try {
      // Import authService dynamically
      const { authService } = await import('@/services/auth');

      // Extract country code from phone number
      const cleanPhone = phoneNumber.replace(/\s/g, '');
      const countryCode = cleanPhone.substring(0, 4); // e.g., "+229"
      const localNumber = cleanPhone.substring(4); // rest of the number

      // Resend OTP
      const result = await authService.sendOTP({
        phoneNumber: localNumber,
        countryCode: countryCode,
      });

      if (result.success) {
        Alert.alert(
          'Code renvoyé',
          `Un nouveau code de vérification a été envoyé au ${maskPhoneNumber(phoneNumber)}`
        );
      } else {
        Alert.alert('Erreur', result.error || 'Impossible de renvoyer le code');
        setCanResend(true);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de renvoyer le code. Veuillez réessayer.');
      setCanResend(true);
    } finally {
      setResendLoading(false);
    }
  };

  const handleTimerComplete = () => {
    setCanResend(true);
  };

  const handleChangeNumber = () => {
    Alert.alert(
      'Modifier le numéro',
      'Voulez-vous vraiment modifier votre numéro de téléphone ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Modifier',
          onPress: () => router.back(),
        },
      ]
    );
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
          <Text style={styles.headerTitle}>Vérification</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="chatbubble-outline" size={32} color={Colors.primary} />
            </View>
          </View>

          {/* Title and subtitle */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Code de vérification</Text>
            <Text style={styles.subtitle}>
              Nous avons envoyé un code à 6 chiffres au numéro
            </Text>
            <Text style={styles.phoneNumber}>{maskPhoneNumber(phoneNumber)}</Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            <OTPInput
              value={otpCode}
              onChangeText={handleOTPChange}
              onComplete={handleOTPComplete}
              containerStyle={styles.otpInput}
            />
          </View>

          {/* Timer and Resend */}
          <View style={styles.timerContainer}>
            {!canResend ? (
              <View style={styles.timerWrapper}>
                <Text style={styles.timerLabel}>Renvoyer le code dans </Text>
                <Timer
                  duration={TIMER_DURATION}
                  onComplete={handleTimerComplete}
                  format="ss"
                  textStyle={styles.timerText}
                />
                <Text style={styles.timerLabel}> secondes</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendCode}
                disabled={resendLoading}
              >
                <Text style={styles.resendButtonText}>
                  {resendLoading ? 'Envoi en cours...' : 'Renvoyer le code'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Verify button */}
          <Button
            title="Vérifier"
            onPress={handleVerifyCode}
            variant="primary"
            size="large"
            loading={loading}
            disabled={otpCode.length !== 6}
            style={styles.verifyButton}
          />

          {/* Change number link */}
          <TouchableOpacity style={styles.changeNumberButton} onPress={handleChangeNumber}>
            <Text style={styles.changeNumberText}>Modifier le numéro</Text>
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
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: Spacing['2xl'],
    marginTop: Spacing['2xl'],
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
  },
  title: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  phoneNumber: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  otpContainer: {
    marginBottom: Spacing['3xl'],
  },
  otpInput: {
    width: '100%',
    paddingHorizontal: Spacing.md,
  },
  timerContainer: {
    marginBottom: Spacing['3xl'],
    alignItems: 'center',
  },
  timerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  timerText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  resendButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  resendButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  verifyButton: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  changeNumberButton: {
    paddingVertical: Spacing.sm,
  },
  changeNumberText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
