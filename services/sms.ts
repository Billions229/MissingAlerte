import axios, { AxiosResponse } from 'axios';

export interface SMSResponse {
  success: boolean;
  error?: string;
  data?: any;
  messageId?: string;
}

export interface SendSMSParams {
  phoneNumber: string;
  message: string;
  retries?: number;
}

export interface SendOTPParams {
  phoneNumber: string;
  code: string;
  appName?: string;
}

class SMSService {
  private baseUrl: string;
  private apiKey: string;
  private deviceId: string;

  constructor() {
    this.baseUrl = process.env.EXPO_PUBLIC_TEXTBEE_BASE_URL || 'https://api.textbee.dev/api/v1';
    this.apiKey = process.env.EXPO_PUBLIC_TEXTBEE_API_KEY || '';
    this.deviceId = process.env.EXPO_PUBLIC_TEXTBEE_DEVICE_ID || '';
  }

  /**
   * Send SMS using TextBee API
   */
  async sendSMS({ phoneNumber, message, retries = 3 }: SendSMSParams): Promise<SMSResponse> {
    if (!this.apiKey || !this.deviceId) {
      return {
        success: false,
        error: 'Configuration SMS manquante. Veuillez vérifier les variables d\'environnement.',
      };
    }

    let lastError: string = '';

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response: AxiosResponse = await axios.post(
          `${this.baseUrl}/gateway/devices/${this.deviceId}/send-sms`,
          {
            recipients: [phoneNumber],
            message: message,
          },
          {
            headers: {
              'x-api-key': this.apiKey,
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 seconds timeout
          }
        );

        if (response.status === 200 || response.status === 201) {
          return {
            success: true,
            data: response.data,
            messageId: response.data?.messageId || response.data?.id,
          };
        } else {
          lastError = `Erreur HTTP ${response.status}: ${response.statusText}`;
        }
      } catch (error: any) {
        if (error.response) {
          // Server responded with error status
          lastError = `Erreur serveur ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
        } else if (error.request) {
          // Request was made but no response received
          lastError = 'Aucune réponse du serveur SMS. Vérifiez votre connexion internet.';
        } else {
          // Something else happened
          lastError = error.message || 'Erreur inconnue lors de l\'envoi du SMS';
        }

        // Wait before retry (exponential backoff)
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    return {
      success: false,
      error: `Échec après ${retries} tentatives. Dernière erreur: ${lastError}`,
    };
  }

  /**
   * Send OTP code via SMS
   */
  async sendOTP({ phoneNumber, code, appName = 'Missing Alert' }: SendOTPParams): Promise<SMSResponse> {
    const message = this.formatOTPMessage(code, appName);
    
    return this.sendSMS({
      phoneNumber,
      message,
      retries: 2, // Fewer retries for OTP to avoid delays
    });
  }

  /**
   * Format OTP message with security best practices
   */
  private formatOTPMessage(code: string, appName: string): string {
    return `${appName}: Votre code de vérification est ${code}. Ce code expire dans 10 minutes. Ne le partagez avec personne.`;
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // Remove all non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // Check if it starts with + and has 10-15 digits
    const phoneRegex = /^\+[1-9]\d{9,14}$/;
    return phoneRegex.test(cleaned);
  }

  /**
   * Format phone number for SMS sending
   */
  formatPhoneNumber(phoneNumber: string): string {
    // Remove all spaces and non-digit characters except +
    return phoneNumber.replace(/[^\d+]/g, '');
  }

  /**
   * Generate random OTP code
   */
  generateOTPCode(length: number = 6): string {
    const digits = '0123456789';
    let code = '';
    
    for (let i = 0; i < length; i++) {
      code += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    
    return code;
  }

  /**
   * Check service status
   */
  async checkServiceStatus(): Promise<SMSResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/gateway/devices/${this.deviceId}/status`,
        {
          headers: {
            'x-api-key': this.apiKey,
          },
          timeout: 5000,
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Impossible de vérifier le statut du service SMS',
      };
    }
  }

  /**
   * Get SMS delivery status
   */
  async getDeliveryStatus(messageId: string): Promise<SMSResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/gateway/messages/${messageId}/status`,
        {
          headers: {
            'x-api-key': this.apiKey,
          },
          timeout: 5000,
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Impossible de récupérer le statut de livraison',
      };
    }
  }
}

export const smsService = new SMSService();
