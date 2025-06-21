import './global.css';
import { StoreProvider } from '../providers/StoreProvider';

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
    <html lang="fr">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
