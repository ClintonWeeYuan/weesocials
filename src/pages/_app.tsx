import '@/src/styles/globals.css'
import type {AppProps} from 'next/app'
import {NextPage} from "next";
import type {ReactElement, ReactNode} from "react";
import {Component} from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};


export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
