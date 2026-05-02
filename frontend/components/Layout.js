import Header from './Header';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Toaster position="top-right" />
      <Header />
      
      {/* 
          Notice: No "max-w" or "mx-auto" here. 
          The individual pages will handle their own spacing.
      */}
      <main>
        {children}
      </main>

    </div>
  );
}