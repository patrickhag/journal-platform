import * as React from 'react';
import { Html, Button } from "@react-email/components";

export const EmailPasswordReset: React.FC<{ url: string }> = (props) => {
    const { url } = props;

    return (
        <Html lang="en">
            <Button href={url}>Click me</Button>
        </Html>
    );
}
