import { Button, Html } from "@react-email/components";
import type * as React from "react";

export const EmailPasswordReset: React.FC<{ url: string }> = (props) => {
	const { url } = props;

	return (
		<Html lang="en">
			<Button href={url}>Click me</Button>
		</Html>
	);
};
