import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Mobile Optimization Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="theme-color" content="#c2185b" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MideAtelier" />

        {/* SEO Meta Tags */}
        <meta name="description" content="MideAtelier Fashion Store - Professional, world-class fashion designs with bespoke tailoring services. Discover elegant dresses and sophisticated fashion in Nigeria." />
        <meta name="keywords" content="fashion, dresses, bespoke, tailoring, Nigeria, elegant, sophisticated, custom made" />
        <meta name="author" content="MideAtelier Fashion Store" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="MideAtelier Fashion Store" />
        <meta property="og:description" content="Professional, world-class fashion designs with bespoke tailoring services" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MideAtelier" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MideAtelier Fashion Store" />
        <meta name="twitter:description" content="Professional, world-class fashion designs with bespoke tailoring services" />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preconnect to Google Fonts for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for Performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
