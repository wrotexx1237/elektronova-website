'use client';

import { useState, useTransition, useEffect } from 'react';
import { saveVerificationFile, listVerificationFiles, deleteVerificationFile } from './actions';

const BASE_URL = 'https://elektronova.online';

export default function GscAdminPage() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const loadFiles = () => {
    startTransition(async () => {
      const list = await listVerificationFiles();
      setFiles(list);
    });
  };

  useEffect(() => { loadFiles(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    setResult(null);

    startTransition(async () => {
      const res = await saveVerificationFile(token.trim());
      if (res.ok) {
        setResult({ ok: true, message: `✅ Skedari u krijua: ${res.file}` });
        setToken('');
        loadFiles();
      } else {
        setResult({ ok: false, message: `❌ ${res.error}` });
      }
    });
  };

  const handleDelete = (fileName: string) => {
    startTransition(async () => {
      await deleteVerificationFile(fileName);
      loadFiles();
    });
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#080808', minHeight: '100vh', color: '#fff', padding: '48px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#12121a', border: '1px solid #2a2a40', borderRadius: 99, padding: '6px 14px', marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#4ade80' }}>Faqe Private · Admin</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px', lineHeight: 1.2 }}>
            Google Search Console
          </h1>
          <p style={{ color: '#666', fontSize: 15, margin: 0 }}>
            Verifikimi automatik i domenës <code style={{ color: '#4f8ef7', background: '#0d1a2e', padding: '2px 8px', borderRadius: 6 }}>elektronova.online</code>
          </p>
        </div>

        {/* Main Card */}
        <div style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: 16, padding: 32, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: '#ccc' }}>
            Hapi 1 — Fut Token-in nga Google
          </h2>
          <p style={{ color: '#555', fontSize: 13, margin: '0 0 20px', lineHeight: 1.6 }}>
            Nga Google Search Console → zgjidh metodën <strong style={{ color: '#888' }}>HTML file</strong> ose <strong style={{ color: '#888' }}>HTML tag</strong> → kopjo kodin që të jepet (p.sh. <code style={{ color: '#f97316', fontSize: 12 }}>google-site-verification=abc123xyz</code>) dhe ngjiti poshtë:
          </p>

          <form onSubmit={handleSubmit}>
            <textarea
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="Ngjit kodin e Google këtu&#10;Shembull: google-site-verification=abc123xyz456&#10;ose thjesht: abc123xyz456"
              rows={3}
              style={{
                width: '100%', boxSizing: 'border-box' as const,
                background: '#0d0d0d', border: '1px solid #2a2a2a',
                borderRadius: 10, padding: '14px 16px', fontSize: 14,
                color: '#fff', fontFamily: 'monospace', resize: 'vertical' as const,
                outline: 'none', lineHeight: 1.5,
              }}
            />

            <button
              type="submit"
              disabled={isPending || !token.trim()}
              style={{
                marginTop: 12, width: '100%', padding: '13px 20px',
                background: isPending || !token.trim() ? '#1a1a1a' : '#1d4ed8',
                color: isPending || !token.trim() ? '#444' : '#fff',
                border: '1px solid ' + (isPending || !token.trim() ? '#2a2a2a' : '#2563eb'),
                borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: isPending || !token.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isPending ? '⏳ Duke ruajtur...' : '🚀 Krijo Skedarin e Verifikimit'}
            </button>
          </form>

          {/* Result message */}
          {result && (
            <div style={{
              marginTop: 16, padding: '12px 16px', borderRadius: 10,
              background: result.ok ? '#0a2a0a' : '#2a0a0a',
              border: '1px solid ' + (result.ok ? '#22c55e40' : '#ef444440'),
              color: result.ok ? '#4ade80' : '#f87171',
              fontSize: 14, fontFamily: 'monospace', fontWeight: 600,
            }}>
              {result.message}
            </div>
          )}
        </div>

        {/* Step 2 — Verify */}
        <div style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: 16, padding: 32, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: '#ccc' }}>
            Hapi 2 — Verifiko tek Google
          </h2>
          <p style={{ color: '#555', fontSize: 13, margin: '0 0 20px', lineHeight: 1.6 }}>
            Pasi të krijosh skedarin, shko përsëri tek Google Search Console dhe kliko <strong style={{ color: '#4f8ef7' }}>VERIFY</strong>.
          </p>

          {/* Existing files */}
          {files.length > 0 ? (
            <div>
              <p style={{ color: '#888', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>📁 Skedarë aktiv:</p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                {files.map(file => (
                  <div key={file} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#0d1a0d', border: '1px solid #22c55e20', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#4ade80' }}>{file}</div>
                      <a
                        href={`${BASE_URL}/${file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 11, color: '#4f8ef7', textDecoration: 'none', opacity: 0.7 }}
                      >
                        🔗 {BASE_URL}/{file}
                      </a>
                    </div>
                    <button
                      onClick={() => handleDelete(file)}
                      disabled={isPending}
                      style={{ flexShrink: 0, padding: '5px 12px', background: 'transparent', border: '1px solid #3a1a1a', borderRadius: 8, color: '#f87171', fontSize: 12, cursor: 'pointer' }}
                    >
                      Fshi
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ color: '#333', fontSize: 13, fontStyle: 'italic' }}>Ende nuk ka skedarë verifikimi.</p>
          )}

          {/* GSC link */}
          <a
            href="https://search.google.com/search-console"
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, background: '#0d1a2e', border: '1px solid #4f8ef730', borderRadius: 10, padding: '12px 16px', textDecoration: 'none', color: '#4f8ef7', fontSize: 14, fontWeight: 600 }}
          >
            <span style={{ fontSize: 18 }}>🔗</span>
            <span>Hap Google Search Console</span>
            <span style={{ marginLeft: 'auto', opacity: 0.5, fontSize: 12 }}>↗</span>
          </a>
        </div>

        {/* How it works */}
        <div style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: 16, padding: 24 }}>
          <p style={{ fontSize: 12, color: '#444', margin: 0, lineHeight: 1.8 }}>
            <strong style={{ color: '#555', display: 'block', marginBottom: 6 }}>Si funksionon:</strong>
            Serveri krijon skedarin <code style={{ color: '#888' }}>googleTOKEN.html</code> brenda dosjes <code style={{ color: '#888' }}>public/</code>. 
            Kjo bën që URL-ja <code style={{ color: '#888' }}>elektronova.online/googleTOKEN.html</code> të jetë e qasshme nga Google për verifikim.
            Pasi verifikimi kryhet, skedarin mund ta fshish.
          </p>
        </div>

        <div style={{ marginTop: 32, textAlign: 'center' as const, color: '#333', fontSize: 11 }}>
          🔒 Faqe private · noindex · nofollow · pa sitemap
        </div>
      </div>
    </div>
  );
}
