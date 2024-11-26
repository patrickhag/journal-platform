"use client";
import type React from "react";
import { Suspense } from "react";

const Layout: React.FC<
	Readonly<{
		children: React.ReactNode;
	}>
> = ({ children }) => {
	return <Suspense>{children}</Suspense>;
};

export default Layout;
