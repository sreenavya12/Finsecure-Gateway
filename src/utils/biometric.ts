
/**
 * Utility for WebAuthn (Passkeys) / Biometric Authentication
 * Focused on Mobile devices with built-in sensors.
 */

// Helper to convert ArrayBuffer to Base64URL
const bufferToBase64URL = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (const charCode of bytes) {
    str += String.fromCharCode(charCode);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

// Helper to convert Base64URL to ArrayBuffer
const base64URLToBuffer = (base64url: string) => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const str = atob(base64);
  const buffer = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    buffer[i] = str.charCodeAt(i);
  }
  return buffer.buffer;
};

/**
 * Checks if the current device is mobile and has biometric support.
 */
export const checkHardwareSupport = async (): Promise<{ isMobile: boolean; hasBiometrics: boolean }> => {
  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  
  const hasBiometrics = !!(
    window.PublicKeyCredential &&
    await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  );

  return { isMobile, hasBiometrics };
};

/**
 * Registers a new biometric credential for the user.
 */
export const registerBiometrics = async (customerId: string, fullName: string) => {
  if (!window.PublicKeyCredential) throw new Error("Biometrics not supported on this browser.");

  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);

  const userId = new TextEncoder().encode(customerId);

  const publicKeyOptions: PublicKeyCredentialCreationOptions = {
    challenge,
    rp: { name: "FinSecure Gateway", id: window.location.hostname },
    user: {
      id: userId,
      name: customerId,
      displayName: fullName,
    },
    pubKeyCredParams: [
      { alg: -7, type: "public-key" }, // ES256
      { alg: -257, type: "public-key" }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: "platform", // Forces built-in sensors (Fingerprint/FaceID)
      userVerification: "required",
    },
    timeout: 60000,
    attestation: "none",
  };

  const credential = (await navigator.credentials.create({
    publicKey: publicKeyOptions,
  })) as PublicKeyCredential;

  if (!credential) throw new Error("Failed to create biometric credential.");

  const response = credential.response as AuthenticatorAttestationResponse;
  const publicKey = response.getPublicKey();

  if (!publicKey) throw new Error("Failed to retrieve public key from device sensor.");

  return {
    credentialId: bufferToBase64URL(credential.rawId),
    publicKey: bufferToBase64URL(publicKey),
  };
};

/**
 * Authenticates a user using their registered biometric credential.
 */
export const authenticateBiometrics = async (credentialId: string) => {
  if (!window.PublicKeyCredential) throw new Error("Biometrics not supported.");

  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);

  const publicKeyOptions: PublicKeyCredentialRequestOptions = {
    challenge,
    timeout: 60000,
    userVerification: "required",
    allowCredentials: [
      {
        id: base64URLToBuffer(credentialId),
        type: "public-key",
        transports: ["internal"],
      },
    ],
  };

  const assertion = (await navigator.credentials.get({
    publicKey: publicKeyOptions,
  })) as PublicKeyCredential;

  if (!assertion) throw new Error("Biometric authentication failed.");

  return true; // In a production app, we would verify the signature on the server.
};
