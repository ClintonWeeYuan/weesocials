import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { generate } from "random-words";

const Home: NextPage = () => {
  const createNewRoomName = () => {
    return generate(3).join("-");
  }

  return (
    <div>
      <Head>
        <title>Wee Socials</title>
        <meta name="description" content=""/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="flex flex-col md:flex-row mb-4">
          <Link href={`/waiting?room=${createNewRoomName()}`} className="btn btn-accent ml-0 mt-2 md:mt-0 md:ml-2">Create Room</Link>
        </div>
      </main>
    </div>
  );
};

export default Home