import '../styles/globals.css';

export const metadata = {
  title: 'AI Content Marketer & Video Editor | Premium Portfolio',
  description:
    'Premium portfolio for an AI-powered content strategist and video editor helping founders, CXOs, and personal brands scale authority and revenue.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'AI Content Marketer & Video Editor',
    description: 'Conversion-focused content systems and performance video editing for high-ticket client growth.',
    type: 'website'
  },
  keywords: ['AI content strategist', 'video editor', 'founder personal brand', 'high-ticket leads', 'content marketing']
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
