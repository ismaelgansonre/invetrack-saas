import './global.css';
import { StoreProvider } from '../providers/StoreProvider';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'Invetrack - Gestion d\'inventaire SaaS',
  description: 'Plateforme de gestion d\'inventaire multi-tenant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StoreProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
