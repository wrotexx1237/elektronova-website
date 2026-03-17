// Isolated layout — no header, no footer, no shared UI
export default function HiddenLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq">
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <meta name="googlebot" content="noindex, nofollow" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0a0a0a' }}>
        {children}
      </body>
    </html>
  );
}
