import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="flex min-h-[100dvh]">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-4">
        {title && (
          <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm px-4 py-3 md:px-6 md:py-4">
            <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
          </header>
        )}
        <div className="px-4 py-4 md:px-6 animate-fade-in">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
