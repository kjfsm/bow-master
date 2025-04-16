import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "バイオリン音色分析アプリ",
  description: "バイオリンの基礎練習で音色を可視化・分析するWebアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-white font-sans text-black">{children}</body>
    </html>
  );
}
