import type { AppProps /*, AppContext */ } from 'next/app'
import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }:AppProps) {
  return (
		<>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main >
<Component {...pageProps} />
				</main>
			</>
	)
}

export default MyApp
