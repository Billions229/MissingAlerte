import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Button, Container, Input, PhoneInput } from '@/components/ui';
import { Colors, Spacing, Typography } from '@/constants/Theme';
import { UserType } from '@/lib/supabase';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    userType: 'family' as UserType,
  });
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Le numéro de téléphone est requis';
    } else {
      const phoneRegex = /^[0-9]{8,15}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
        newErrors.phoneNumber = 'Veuillez saisir un numéro de téléphone valide';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Import authService dynamically
      const { authService } = await import('@/services/auth');

      // Send OTP for new user registration
      const result = await authService.sendOTP({
        phoneNumber: formData.phoneNumber,
        countryCode: selectedCountry?.dialCode || '+229',
      });

      if (!result.success) {
        Alert.alert('Erreur', result.error || 'Erreur lors de l\'envoi du code');
        return;
      }

      // Navigate to OTP verification screen for new user
      const fullPhoneNumber = `${selectedCountry?.dialCode || '+229'} ${formData.phoneNumber}`;
      router.push({
        pathname: '/verify-otp',
        params: {
          phoneNumber: fullPhoneNumber,
          isNewUser: 'true',
          fullName: formData.fullName,
          userType: formData.userType,
        },
      });
    } catch (err) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la création du compte. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
          <Text style={styles.headerTitle}>Créer un compte</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Content */}
          <View style={styles.content}>
            {/* Title and subtitle */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Rejoignez Missing Alert</Text>
              <Text style={styles.subtitle}>
                Créez votre compte pour aider à retrouver les personnes disparues
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Full Name */}
              <Input
                label="Nom complet"
                value={formData.fullName}
                onChangeText={(text) => updateFormData('fullName', text)}
                placeholder="Saisissez votre nom complet"
                error={errors.fullName}
                autoComplete="name"
                textContentType="name"
              />

              {/* Phone Number */}
              <PhoneInput
                label="Numéro de téléphone"
                value={formData.phoneNumber}
                onChangeText={(text) => updateFormData('phoneNumber', text)}
                onChangeCountry={setSelectedCountry}
                placeholder="Saisissez votre numéro"
                error={errors.phoneNumber}
                containerStyle={styles.phoneInputContainer}
              />

              {/* User Type Selection */}
              <View style={styles.userTypeContainer}>
                <Text style={styles.userTypeLabel}>Je suis :</Text>
                
                <View style={styles.userTypeOptions}>
                  <TouchableOpacity
                    style={[
                      styles.userTypeOption,
                      formData.userType === 'family' && styles.userTypeOptionSelected,
                    ]}
                    onPress={() => updateFormData('userType', 'family')}
                  >
                    <View style={styles.userTypeIconContainer}>
                      <Ionicons 
                        name="people" 
                        size={24} 
                        color={formData.userType === 'family' ? Colors.white : Colors.primary} 
                      />
                    </View>
                    <Text style={[
                      styles.userTypeOptionText,
                      formData.userType === 'family' && styles.userTypeOptionTextSelected,
                    ]}>
                      Famille
                    </Text>
                    <Text style={[
                      styles.userTypeOptionDescription,
                      formData.userType === 'family' && styles.userTypeOptionDescriptionSelected,
                    ]}>
                      Signaler une disparition
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.userTypeOption,
                      formData.userType === 'volunteer' && styles.userTypeOptionSelected,
                    ]}
                    onPress={() => updateFormData('userType', 'volunteer')}
                  >
                    <View style={styles.userTypeIconContainer}>
                      <Ionicons 
                        name="heart" 
                        size={24} 
                        color={formData.userType === 'volunteer' ? Colors.white : Colors.primary} 
                      />
                    </View>
                    <Text style={[
                      styles.userTypeOptionText,
                      formData.userType === 'volunteer' && styles.userTypeOptionTextSelected,
                    ]}>
                      Bénévole
                    </Text>
                    <Text style={[
                      styles.userTypeOptionDescription,
                      formData.userType === 'volunteer' && styles.userTypeOptionDescriptionSelected,
                    ]}>
                      Aider dans les recherches
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Create Account Button */}
              <Button
                title="Créer mon compte"
                onPress={handleSignup}
                variant="primary"
                size="large"
                loading={loading}
                disabled={!formData.fullName.trim() || !formData.phoneNumber.trim()}
                style={styles.signupButton}
              />

              {/* Terms and Privacy */}
              <Text style={styles.termsText}>
                En créant un compte, vous acceptez nos{' '}
                <Text style={styles.termsLink}>Conditions d'utilisation</Text>
                {' '}et notre{' '}
                <Text style={styles.termsLink}>Politique de confidentialité</Text>
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Vous avez déjà un compte ?{' '}
          </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.footerLink}>Se connecter</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  titleContainer: {
    marginBottom: Spacing['3xl'],
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
    lineHeight: Typography.lineHeight.relaxed * Typography.base,
  },
  formContainer: {
    marginBottom: Spacing.xl,
  },
  phoneInputContainer: {
    marginBottom: Spacing.lg,
  },
  userTypeContainer: {
    marginBottom: Spacing['2xl'],
  },
  userTypeLabel: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  userTypeOptions: {
    gap: Spacing.lg,
  },
  userTypeOption: {
    padding: Spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  userTypeOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  userTypeIconContainer: {
    marginBottom: Spacing.sm,
  },
  userTypeOptionText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  userTypeOptionTextSelected: {
    color: Colors.white,
  },
  userTypeOptionDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  userTypeOptionDescriptionSelected: {
    color: Colors.white,
    opacity: 0.9,
  },
  signupButton: {
    marginBottom: Spacing.lg,
  },
  termsText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.sm,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: Typography.semibold,
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
