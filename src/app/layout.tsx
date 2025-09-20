"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux/store";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const Loading = ({ id = '', className = '' }) => {
  return <>
    <div id={id} className={`flex fixed items-center justify-center top-0 left-0 w-full h-full z-[9999] backdrop-blur ${className}`}>
      <div>
        <img
          src="/img/loader.gif"
          alt="logo"
          className="w-[50px]"
        />
      </div>
    </div>
  </>
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
              {children}
          </PersistGate>
        </Provider>

        <ToastContainer />
        <Loading id="loader" className="hidden" />
      </body>
    </html>
  );
}
