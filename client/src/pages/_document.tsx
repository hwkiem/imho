import Document from 'next/document';
import { ServerStyles, createStylesServer } from '@mantine/next';
import { Html, Head, Main, NextScript } from 'next/document';

const stylesServer = createStylesServer();

export default class _Document extends Document {
    render() {
        return (
            <Html lang="en">
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

_Document.getInitialProps = async (ctx) => {
    const initialProps = await Document.getInitialProps(ctx);

    // Add your app specific logic here

    return {
        ...initialProps,
        styles: (
            <>
                {initialProps.styles}
                <ServerStyles html={initialProps.html} server={stylesServer} />
            </>
        ),
    };
};
