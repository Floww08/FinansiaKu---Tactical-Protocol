import "./globals.css";

export const metadata = {
  title: "FinansiaKu - Tactical Protocol",
  description: "Advanced Financial Management System V6.2",
  icons: {
    icon: '/favicon.svg', 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Google Fonts: Plus Jakarta Sans & Share Tech Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
        
        {/* FontAwesome untuk Ikon Tactical */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        
        {/* Chart.js untuk Radar (Tahap 3 nanti) */}
        <script src="https://cdn.jsdelivr.net/npm/chart.js" async></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}