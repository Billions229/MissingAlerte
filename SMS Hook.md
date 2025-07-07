
Tu peux tout à fait utiliser **TextBee** comme fournisseur SMS avec Supabase, même s’il n’est pas listé nativement dans les options (comme Twilio, MessageBird, etc.). Supabase propose une fonctionnalité appelée **"Send SMS Hook"** qui permet d’intégrer un fournisseur SMS personnalisé via une fonction Edge.

### Comment intégrer TextBee comme SMS provider avec Supabase ?

1. **Activer le Send SMS Hook dans Supabase**
Dans ton dashboard Supabase, va dans la section Auth > Hooks, puis :
    - Ajoute un nouveau hook de type **Send SMS hook**
    - Active-le et choisis le type **HTTPS**
    - Renseigne l’URL de ton endpoint (tu vas créer une fonction Edge qui fera le lien avec TextBee)
    - Génére un secret pour sécuriser la communication
2. **Créer une fonction Edge (sms-hook)**
Utilise le Supabase CLI pour créer une fonction Edge qui va recevoir les requêtes d’envoi de SMS et appeler l’API TextBee pour envoyer les OTP.
Exemple de workflow :
    - La fonction reçoit la requête avec le numéro et le code OTP
    - Elle appelle l’API TextBee (via HTTPS) pour envoyer le SMS
    - Elle retourne le statut à Supabase
3. **Configurer les variables d’environnement**
Dans ta fonction Edge, stocke les clés API TextBee et autres paramètres nécessaires pour l’authentification et l’envoi des messages.
4. **Déployer la fonction**
Déploie ta fonction Edge avec la commande :

```bash
npx supabase functions deploy sms-hook --no-verify-jwt
```

5. **Tester l’envoi de SMS**
Une fois tout en place, Supabase utilisera ta fonction personnalisée pour envoyer les SMS via TextBee.

### Ressources utiles

- Article détaillé sur la mise en place d’un SMS hook personnalisé (avec un autre fournisseur, mais le principe est le même) :
[Using Supabase SMS-Hook to Send Custom Authentication Messages](https://dev.to/acetrondi/using-supabase-sms-hook-to-send-custom-authentication-messages-in-india-4nj7)[^2]
- Documentation officielle Supabase sur le Send SMS Hook :
[Send SMS Hook | Supabase Docs](https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook)[^5]
- Exemple d’intégration d’un fournisseur tiers avec Supabase Edge Functions :
[Reddit discussion sur intégration SMS providers](https://www.reddit.com/r/Supabase/comments/16x9umh/integrate_other_sms_providers_with_supabase/)[^3]


### En résumé

**Même si TextBee n’est pas une option native dans Supabase, tu peux l’utiliser en créant un SMS Hook personnalisé via une fonction Edge qui fera l’interface entre Supabase et TextBee.** C’est la solution recommandée pour utiliser un fournisseur SMS local ou alternatif avantageux pour toi, sans passer par Twilio ou autres fournisseurs intégrés par défaut.

Si tu souhaites, je peux t’aider à écrire un exemple de fonction Edge pour TextBee.

<div style="text-align: center">⁂</div>

[^1]: https://app.textbee.dev

[^2]: https://dev.to/acetrondi/using-supabase-sms-hook-to-send-custom-authentication-messages-in-india-4nj7

[^3]: https://www.reddit.com/r/Supabase/comments/16x9umh/integrate_other_sms_providers_with_supabase/

[^4]: https://www.youtube.com/watch?v=GlfEBT8LAzc

[^5]: https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook

[^6]: https://www.twilio.com/en-us/blog/send-sms-notifications-supabase-users-node-js-twilio-messaging

[^7]: https://github.com/supabase/auth/issues/1582

[^8]: https://stackoverflow.com/questions/79643187/build-sms-auth-with-custom-provider-in-supabase

[^9]: https://docs-pgth9qjfy-supabase.vercel.app/docs/guides/auth/phone-login/messagebird

[^10]: https://n8n.io/integrations/sms-magic/and/supabase/

[^11]: https://stackoverflow.com/questions/79120434/integrating-a-3rd-party-sms-service-with-supabase

