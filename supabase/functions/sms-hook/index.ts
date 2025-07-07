import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface SMSHookPayload {
  user: {
    id: string
    phone: string
    email?: string
  }
  otp: string
  token_hash: string
  redirect_to?: string
}

interface TextBeeResponse {
  success: boolean
  error?: string
  data?: any
  messageId?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify the request is from Supabase
    const authHeader = req.headers.get('authorization')
    const hookSecret = Deno.env.get('SMS_HOOK_SECRET')
    
    if (!authHeader || !hookSecret) {
      console.error('Missing authorization header or hook secret')
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Extract the secret from the authorization header
    const providedSecret = authHeader.replace('Bearer ', '')
    if (providedSecret !== hookSecret) {
      console.error('Invalid hook secret')
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse the request body
    const payload: SMSHookPayload = await req.json()
    console.log('SMS Hook payload received:', { 
      userId: payload.user.id, 
      phone: payload.user.phone 
    })

    // Validate required fields
    if (!payload.user.phone || !payload.otp) {
      console.error('Missing required fields:', { 
        phone: !!payload.user.phone, 
        otp: !!payload.otp 
      })
      return new Response(
        JSON.stringify({ error: 'Missing required fields: phone or otp' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send SMS via TextBee
    const smsResult = await sendSMSViaTextBee(payload.user.phone, payload.otp)
    
    if (!smsResult.success) {
      console.error('Failed to send SMS:', smsResult.error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send SMS', 
          details: smsResult.error 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('SMS sent successfully:', { 
      messageId: smsResult.messageId,
      phone: payload.user.phone 
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: smsResult.messageId 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('SMS Hook error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function sendSMSViaTextBee(phoneNumber: string, otp: string): Promise<TextBeeResponse> {
  const baseUrl = Deno.env.get('TEXTBEE_BASE_URL') || 'https://api.textbee.dev/api/v1'
  const apiKey = Deno.env.get('TEXTBEE_API_KEY')
  const deviceId = Deno.env.get('TEXTBEE_DEVICE_ID')
  const appName = Deno.env.get('APP_NAME') || 'Missing Alert'

  if (!apiKey || !deviceId) {
    return {
      success: false,
      error: 'Configuration SMS manquante. Vérifiez les variables d\'environnement TEXTBEE_API_KEY et TEXTBEE_DEVICE_ID.',
    }
  }

  // Format the OTP message
  const message = `${appName}: Votre code de vérification est ${otp}. Ce code expire dans 10 minutes. Ne le partagez avec personne.`

  try {
    const response = await fetch(
      `${baseUrl}/gateway/devices/${deviceId}/send-sms`,
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: [phoneNumber],
          message: message,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `Erreur HTTP ${response.status}: ${errorText}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      data: data,
      messageId: data?.messageId || data?.id,
    }

  } catch (error) {
    return {
      success: false,
      error: `Erreur lors de l'envoi du SMS: ${error.message}`,
    }
  }
}
