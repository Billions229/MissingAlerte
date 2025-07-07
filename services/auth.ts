import { supabase, Profile, UserType } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export interface LoginWithPhoneParams {
  phoneNumber: string;
  countryCode: string;
}

export interface VerifyOTPParams {
  phoneNumber: string;
  token: string;
}

export interface CreateProfileParams {
  userId: string;
  phoneNumber: string;
  fullName: string;
  userType: UserType;
  avatarUrl?: string;
}

class AuthService {
  /**
   * Send OTP to phone number for login/signup
   */
  async sendOTP({ phoneNumber, countryCode }: LoginWithPhoneParams): Promise<AuthResponse> {
    try {
      // Format phone number (remove spaces and ensure proper format)
      const formattedPhone = `${countryCode}${phoneNumber.replace(/\s/g, '')}`;
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          // You can customize the SMS template here
          data: {
            app_name: 'Missing Alert',
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Une erreur inattendue est survenue',
      };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP({ phoneNumber, token }: VerifyOTPParams): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token,
        type: 'sms',
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Une erreur inattendue est survenue',
      };
    }
  }

  /**
   * Create user profile after successful authentication
   */
  async createProfile(params: CreateProfileParams): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: params.userId,
          phone_number: params.phoneNumber,
          full_name: params.fullName,
          user_type: params.userType,
          avatar_url: params.avatarUrl,
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Une erreur inattendue est survenue',
      };
    }
  }

  /**
   * Get user profile by user ID
   */
  async getProfile(userId: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Une erreur inattendue est survenue',
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Une erreur inattendue est survenue',
      };
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Une erreur inattendue est survenue',
      };
    }
  }

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Check if user has completed profile setup
   */
  async hasCompletedProfile(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();
