import { FC, ReactNode } from "react";
import Head from "next/head";


interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="relative">
      <Head>
        <title>ChambersLab</title>
        <link rel="shortcut icon" href="/chamberslab-logo-only.png" />
      </Head>
      <div className="flex flex-col min-h-screen bg-base-200">{children}</div>
    </div>
  );
};
export default Layout;
