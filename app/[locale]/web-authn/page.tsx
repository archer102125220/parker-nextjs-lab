'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Base64 } from 'js-base64';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Divider
} from '@mui/material';

import { useAppDispatch } from '@/store';
import style from '@/app/[locale]/web-authn/page.module.scss';

interface CredentialData {
  credentialId: string;
  credentialPublicKeyPem: string;
  credentialPublicKeyJwk: string;
}

export default function WebAuthnPage(): React.ReactNode {
  const dispatch = useAppDispatch();

  // Register form state
  const [registerId, setRegisterId] = useState('testId');
  const [registerAccount, setRegisterAccount] = useState('testAccount');
  const [registerName, setRegisterName] = useState('testName');
  const [registerWebApiOutput, setRegisterWebApiOutput] = useState<string>('');
  const [registerOutput, setRegisterOutput] = useState<string>('');

  // Login form state
  const [loginId, setLoginId] = useState('testId');
  const [loginWebApiOutput, setLoginWebApiOutput] = useState<string>('');
  const [loginOutput, setLoginOutput] = useState<string>('');

  // Credential storage (in production, this should be stored securely)
  const credentialDataRef = useRef<CredentialData | null>(null);

  const [loading, setLoading] = useState(false);

  // Generate challenge from server
  const generateChallenge = async (): Promise<string> => {
    const response = await fetch('/api/web-authn/generate-challenge');
    const challengeString = await response.json();
    return challengeString;
  };

  // Generate public key creation options
  const generatePublicKeyCreationOptions = async () => {
    const challengeString = await generateChallenge();
    const challengeUint8 = Base64.toUint8Array(challengeString);
    // Cast to BufferSource for TypeScript compatibility
    const challenge = challengeUint8.buffer.slice(
      challengeUint8.byteOffset,
      challengeUint8.byteOffset + challengeUint8.byteLength
    ) as ArrayBuffer;

    const rpId =
      typeof window !== 'undefined' ? window.location.hostname : undefined;

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
      {
        challenge,
        rp: {
          name: 'Next.js Lab',
          id: rpId
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -257 }, // RS256 (TPM compatible, prioritized)
          { type: 'public-key', alg: -7 },   // ES256
          { type: 'public-key', alg: -37 }   // PS256 (RSA-PSS)
        ],
        authenticatorSelection: {
          requireResidentKey: true,
          userVerification: 'preferred'
        },
        timeout: 60000,
        attestation: 'none', // Changed from 'direct' to avoid TPM algorithm issues
        user: {
          id: new Uint8Array(0), // Will be set in register function
          name: '',
          displayName: ''
        }
      };

    return { publicKeyCredentialCreationOptions, challengeString, challenge };
  };

  // Handle WebAuthn Registration
  const handleWebAuthnRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const { publicKeyCredentialCreationOptions, challengeString } =
        await generatePublicKeyCreationOptions();

      // Set user info
      const userId = Uint8Array.from(registerId, (c) => c.charCodeAt(0));
      publicKeyCredentialCreationOptions.user = {
        id: userId,
        name: registerAccount,
        displayName: registerName
      };

      // Create credential
      const credential = (await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      })) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create credential');
      }

      const response = credential.response as AuthenticatorAttestationResponse;

      // Format credential for display and API
      const credentialJSON = {
        authenticatorAttachment: credential.authenticatorAttachment,
        id: credential.id,
        rawId: Base64.fromUint8Array(new Uint8Array(credential.rawId), true),
        response: {
          attestationObject: Base64.fromUint8Array(
            new Uint8Array(response.attestationObject),
            true
          ),
          clientDataJSON: Base64.fromUint8Array(
            new Uint8Array(response.clientDataJSON),
            true
          ),
          publicKey: response.getPublicKey
            ? Base64.fromUint8Array(
                new Uint8Array(response.getPublicKey()!),
                true
              )
            : null,
          publicKeyAlgorithm: response.getPublicKeyAlgorithm?.() ?? null,
          transports: response.getTransports?.() ?? []
        },
        type: credential.type
      };

      setRegisterWebApiOutput(JSON.stringify(credentialJSON, null, 2));

      // Send to server for registration
      const serverResponse = await fetch('/api/web-authn/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeString,
          credential: credentialJSON
        })
      });

      const serverData = await serverResponse.json();
      setRegisterOutput(JSON.stringify(serverData, null, 2));

      if (serverData.base64URLServerSaveData) {
        credentialDataRef.current = serverData.base64URLServerSaveData;
        dispatch({ type: 'system/message_success', payload: '憑證註冊成功！' });
      }
    } catch (err) {
      console.error('Registration error:', err);
      dispatch({
        type: 'system/message_error',
        payload: err instanceof Error ? err.message : '註冊失敗'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle WebAuthn Login/Verify
  const handleWebAuthnLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!credentialDataRef.current) {
      dispatch({ type: 'system/message_error', payload: '請先完成註冊' });
      return;
    }

    setLoading(true);

    try {
      const { publicKeyCredentialCreationOptions, challengeString } =
        await generatePublicKeyCreationOptions();

      const credentialIdUint8 = Base64.toUint8Array(
        credentialDataRef.current.credentialId
      );
      const credentialIdBuffer = credentialIdUint8.buffer.slice(
        credentialIdUint8.byteOffset,
        credentialIdUint8.byteOffset + credentialIdUint8.byteLength
      ) as ArrayBuffer;

      const allowCredentials: PublicKeyCredentialDescriptor[] = [
        {
          id: credentialIdBuffer,
          type: 'public-key',
          transports: ['internal', 'usb', 'ble', 'nfc']
        }
      ];

      // Get credential
      const credential = (await navigator.credentials.get({
        publicKey: {
          ...publicKeyCredentialCreationOptions,
          allowCredentials
        }
      })) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to get credential');
      }

      const response = credential.response as AuthenticatorAssertionResponse;

      // Format credential for display and API
      const credentialJSON = {
        authenticatorAttachment: credential.authenticatorAttachment,
        id: credential.id,
        rawId: Base64.fromUint8Array(new Uint8Array(credential.rawId), true),
        response: {
          authenticatorData: Base64.fromUint8Array(
            new Uint8Array(response.authenticatorData),
            true
          ),
          clientDataJSON: Base64.fromUint8Array(
            new Uint8Array(response.clientDataJSON),
            true
          ),
          signature: Base64.fromUint8Array(
            new Uint8Array(response.signature),
            true
          ),
          userHandle: response.userHandle
            ? Base64.fromUint8Array(new Uint8Array(response.userHandle), true)
            : null
        },
        type: credential.type
      };

      setLoginWebApiOutput(JSON.stringify(credentialJSON, null, 2));

      // Send to server for verification
      const serverResponse = await fetch('/api/web-authn/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: loginId,
          challengeString,
          credential: credentialJSON,
          base64URLServerSaveData: credentialDataRef.current
        })
      });

      const serverData = await serverResponse.json();
      setLoginOutput(JSON.stringify(serverData, null, 2));

      if (serverData.verified) {
        dispatch({ type: 'system/message_success', payload: '登入驗證成功！' });
      } else {
        dispatch({ type: 'system/message_error', payload: '驗證失敗' });
      }
    } catch (err) {
      console.error('Login error:', err);
      dispatch({
        type: 'system/message_error',
        payload: err instanceof Error ? err.message : '驗證失敗'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={style.web_authn_page}>
      <Typography variant="h5" gutterBottom>
        WebAuthn 生物辨識測試
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        原生方式為主，套件用來編碼、解碼的方式實作
      </Typography>

      <Box className={style.web_authn_page_outbound_link}>
        <Typography variant="body2">記錄筆記：</Typography>
        <a
          href="https://www.notion.so/Web-Authn-6480f13abf224ef59a41571df1531f6a"
          target="_blank"
          rel="noopener noreferrer"
        >
          Notion 筆記連結
        </a>
      </Box>

      <Image
        className={style.web_authn_page_banner}
        src="/img/web-authn/web-authn-v.06.webp"
        alt="WebAuthn Banner"
        width={1200}
        height={400}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '400px',
          objectFit: 'cover'
        }}
        priority
      />

      {/* Registration Section */}
      <Paper className={style.web_authn_page_register} elevation={2}>
        <form onSubmit={handleWebAuthnRegister}>
          <Typography variant="h6" className={style.web_authn_page_register_title}>
            向伺服器註冊生物辨識資料
          </Typography>

          <TextField
            fullWidth
            label="ID"
            value={registerId}
            onChange={(e) => setRegisterId(e.target.value)}
            className={style.web_authn_page_register_id}
            margin="normal"
          />
          <TextField
            fullWidth
            label="帳號"
            value={registerAccount}
            onChange={(e) => setRegisterAccount(e.target.value)}
            className={style.web_authn_page_register_account}
            margin="normal"
          />
          <TextField
            fullWidth
            label="名稱"
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
            className={style.web_authn_page_register_name}
            margin="normal"
          />

          <Box className={style.web_authn_page_register_submit}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? '處理中...' : '註冊'}
            </Button>
          </Box>
        </form>

        <Typography
          variant="subtitle2"
          className={style.web_authn_page_register_output_title}
        >
          WebAuthn API 回傳：
        </Typography>
        <Box className={style.web_authn_page_register_output}>
          <pre>{registerWebApiOutput || '(尚未執行)'}</pre>
        </Box>

        <Typography
          variant="subtitle2"
          className="web_authn_page-register-output_title"
        >
          伺服端回傳：
        </Typography>
        <Box className="web_authn_page-register-output">
          <pre>{registerOutput || '(尚未執行)'}</pre>
        </Box>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Login/Verify Section */}
      <Paper className={style.web_authn_page_login} elevation={2}>
        <form onSubmit={handleWebAuthnLogin}>
          <Typography variant="h6" className={style.web_authn_page_login_title}>
            執行身份驗證
          </Typography>

          <TextField
            fullWidth
            label="帳號"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className={style.web_authn_page_login_id}
            margin="normal"
          />

          <Box className={style.web_authn_page_login_submit}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || !credentialDataRef.current}
            >
              {loading ? '處理中...' : '驗證'}
            </Button>
          </Box>
        </form>

        <Typography
          variant="subtitle2"
          className={style.web_authn_page_login_output_title}
        >
          WebAuthn API 回傳：
        </Typography>
        <Box className={style.web_authn_page_login_output}>
          <pre>{loginWebApiOutput || '(尚未執行)'}</pre>
        </Box>

        <Typography
          variant="subtitle2"
          className="web_authn_page-login-output_title"
        >
          伺服端回傳：
        </Typography>
        <Box className="web_authn_page-login-output">
          <pre>{loginOutput || '(尚未執行)'}</pre>
        </Box>
      </Paper>
    </section>
  );
}
