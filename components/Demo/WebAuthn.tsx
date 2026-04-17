'use client';

import { useReducer, useRef, useCallback, type ReactNode, type ChangeEvent, type FormEvent } from 'react';
import { Base64 } from 'js-base64';
import {
  Typography,
  TextField,
  Button,
  Box
} from '@mui/material';
import { useAppDispatch } from '@/store';
import style from '@/app/[locale]/web-authn/page.module.scss';

interface CredentialData {
  credentialId: string;
  credentialPublicKeyPem: string;
  credentialPublicKeyJwk: string;
}

// --------------- State / Reducer ---------------

interface WebAuthnState {
  registerId: string;
  registerAccount: string;
  registerName: string;
  registerWebApiOutput: string;
  registerOutput: string;
  loginId: string;
  loginWebApiOutput: string;
  loginOutput: string;
  loading: boolean;
}

type WebAuthnAction =
  | { type: 'SET_REGISTER_ID'; payload: string }
  | { type: 'SET_REGISTER_ACCOUNT'; payload: string }
  | { type: 'SET_REGISTER_NAME'; payload: string }
  | { type: 'SET_REGISTER_WEB_API_OUTPUT'; payload: string }
  | { type: 'SET_REGISTER_OUTPUT'; payload: string }
  | { type: 'SET_LOGIN_ID'; payload: string }
  | { type: 'SET_LOGIN_WEB_API_OUTPUT'; payload: string }
  | { type: 'SET_LOGIN_OUTPUT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: WebAuthnState = {
  registerId: 'testId',
  registerAccount: 'testAccount',
  registerName: 'testName',
  registerWebApiOutput: '',
  registerOutput: '',
  loginId: 'testId',
  loginWebApiOutput: '',
  loginOutput: '',
  loading: false
};

function webAuthnReducer(
  state: WebAuthnState,
  action: WebAuthnAction
): WebAuthnState {
  switch (action.type) {
    case 'SET_REGISTER_ID':
      return { ...state, registerId: action.payload };
    case 'SET_REGISTER_ACCOUNT':
      return { ...state, registerAccount: action.payload };
    case 'SET_REGISTER_NAME':
      return { ...state, registerName: action.payload };
    case 'SET_REGISTER_WEB_API_OUTPUT':
      return { ...state, registerWebApiOutput: action.payload };
    case 'SET_REGISTER_OUTPUT':
      return { ...state, registerOutput: action.payload };
    case 'SET_LOGIN_ID':
      return { ...state, loginId: action.payload };
    case 'SET_LOGIN_WEB_API_OUTPUT':
      return { ...state, loginWebApiOutput: action.payload };
    case 'SET_LOGIN_OUTPUT':
      return { ...state, loginOutput: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// --------------- Component ---------------

export default function DemoWebAuthn(): ReactNode {
  const dispatch = useAppDispatch();
  const [state, localDispatch] = useReducer(webAuthnReducer, initialState);

  const {
    registerId,
    registerAccount,
    registerName,
    registerWebApiOutput,
    registerOutput,
    loginId,
    loginWebApiOutput,
    loginOutput,
    loading
  } = state;

  // Credential storage (in production, this should be stored securely)
  const credentialDataRef = useRef<CredentialData | null>(null);

  // Generate challenge from server
  const generateChallenge = useCallback(async (): Promise<string> => {
    const response = await fetch('/api/web-authn/generate-challenge');
    const challengeString = await response.json();
    return challengeString;
  }, []);

  // Generate public key creation options
  const generatePublicKeyCreationOptions = useCallback(async () => {
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
          { type: 'public-key', alg: -7 }, // ES256
          { type: 'public-key', alg: -37 } // PS256 (RSA-PSS)
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
  }, [generateChallenge]);

  // Handle WebAuthn Registration
  const handleWebAuthnRegister = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (loading) return;

      localDispatch({ type: 'SET_LOADING', payload: true });

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

        const response =
          credential.response as AuthenticatorAttestationResponse;

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

        localDispatch({
          type: 'SET_REGISTER_WEB_API_OUTPUT',
          payload: JSON.stringify(credentialJSON, null, 2)
        });

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
        localDispatch({
          type: 'SET_REGISTER_OUTPUT',
          payload: JSON.stringify(serverData, null, 2)
        });

        if (serverData.base64URLServerSaveData) {
          credentialDataRef.current = serverData.base64URLServerSaveData;
          dispatch({
            type: 'system/message_success',
            payload: '憑證註冊成功！'
          });
        }
      } catch (err) {
        console.error('Registration error:', err);
        dispatch({
          type: 'system/message_error',
          payload: err instanceof Error ? err.message : '註冊失敗'
        });
      } finally {
        localDispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [
      loading,
      registerId,
      registerAccount,
      registerName,
      generatePublicKeyCreationOptions,
      dispatch
    ]
  );

  // Handle WebAuthn Login/Verify
  const handleWebAuthnLogin = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (loading) return;

      if (!credentialDataRef.current) {
        dispatch({ type: 'system/message_error', payload: '請先完成註冊' });
        return;
      }

      localDispatch({ type: 'SET_LOADING', payload: true });

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
              ? Base64.fromUint8Array(
                  new Uint8Array(response.userHandle),
                  true
                )
              : null
          },
          type: credential.type
        };

        localDispatch({
          type: 'SET_LOGIN_WEB_API_OUTPUT',
          payload: JSON.stringify(credentialJSON, null, 2)
        });

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
        localDispatch({
          type: 'SET_LOGIN_OUTPUT',
          payload: JSON.stringify(serverData, null, 2)
        });

        if (serverData.verified) {
          dispatch({
            type: 'system/message_success',
            payload: '登入驗證成功！'
          });
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
        localDispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [loading, loginId, generatePublicKeyCreationOptions, dispatch]
  );

  // Input change handlers
  const handleRegisterIdChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      localDispatch({ type: 'SET_REGISTER_ID', payload: e.target.value }),
    []
  );
  const handleRegisterAccountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      localDispatch({ type: 'SET_REGISTER_ACCOUNT', payload: e.target.value }),
    []
  );
  const handleRegisterNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      localDispatch({ type: 'SET_REGISTER_NAME', payload: e.target.value }),
    []
  );
  const handleLoginIdChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      localDispatch({ type: 'SET_LOGIN_ID', payload: e.target.value }),
    []
  );

  return (
    <Box className={style['web_authn_page-panels']}>
      {/* Registration Section */}
      <Box className={style['web_authn_page-panel']}>
        <Box className={style['web_authn_page-panel-header']}>
          <Box className={style['web_authn_page-panel-header-icon']} data-type="register">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </Box>
          <Typography variant="h6" className={style['web_authn_page-panel-header-title']}>
            註冊生物辨識
          </Typography>
        </Box>

        <form onSubmit={handleWebAuthnRegister} className={style['web_authn_page-panel-form']}>
          <TextField
            fullWidth
            label="ID"
            value={registerId}
            onChange={handleRegisterIdChange}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="帳號"
            value={registerAccount}
            onChange={handleRegisterAccountChange}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="名稱"
            value={registerName}
            onChange={handleRegisterNameChange}
            variant="outlined"
            size="small"
          />

          <Box className={style['web_authn_page-panel-submit']}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              disableElevation
            >
              {loading ? '處理中...' : '建立 WebAuthn 憑證'}
            </Button>
          </Box>
        </form>

        <Box className={style['web_authn_page-panel-output_wrap']}>
          <Typography className={style['web_authn_page-panel-output_title']}>
            WebAuthn API 輸出
          </Typography>
          <Box className={style['web_authn_page-panel-output']}>
            <pre>{registerWebApiOutput || '等待執行...'}</pre>
          </Box>
        </Box>

        <Box className={style['web_authn_page-panel-output_wrap']}>
          <Typography className={style['web_authn_page-panel-output_title']}>
            伺服器回應
          </Typography>
          <Box className={style['web_authn_page-panel-output']}>
            <pre>{registerOutput || '等待執行...'}</pre>
          </Box>
        </Box>
      </Box>

      {/* Login/Verify Section */}
      <Box className={style['web_authn_page-panel']}>
        <Box className={style['web_authn_page-panel-header']}>
          <Box className={style['web_authn_page-panel-header-icon']} data-type="login">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </Box>
          <Typography variant="h6" className={style['web_authn_page-panel-header-title']}>
            執行身份驗證
          </Typography>
        </Box>

        <form onSubmit={handleWebAuthnLogin} className={style['web_authn_page-panel-form']}>
          <TextField
            fullWidth
            label="帳號"
            value={loginId}
            onChange={handleLoginIdChange}
            variant="outlined"
            size="small"
          />

          <Box className={style['web_authn_page-panel-submit']}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              disabled={loading || !credentialDataRef.current}
              disableElevation
            >
              {loading ? '處理中...' : '進行驗證'}
            </Button>
          </Box>
        </form>

        <Box className={style['web_authn_page-panel-output_wrap']}>
          <Typography className={style['web_authn_page-panel-output_title']}>
            WebAuthn API 輸出
          </Typography>
          <Box className={style['web_authn_page-panel-output']}>
            <pre>{loginWebApiOutput || '等待執行...'}</pre>
          </Box>
        </Box>

        <Box className={style['web_authn_page-panel-output_wrap']}>
          <Typography className={style['web_authn_page-panel-output_title']}>
            伺服器回應
          </Typography>
          <Box className={style['web_authn_page-panel-output']}>
            <pre>{loginOutput || '等待執行...'}</pre>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
