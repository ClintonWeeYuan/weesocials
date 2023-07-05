import type {NextPage} from 'next';
import Head from 'next/head';
import {faker} from '@faker-js/faker';
import Link from 'next/link';
import {useState} from "react";
import { generate, count } from "random-words";
const EXAMPLE_ROUTES = {
  minimal: {title: 'Minimal example', href: `/minimal?user=${faker.person.fullName()}`},
  simple: {title: 'Simple example', href: `/simple?user=${faker.person.fullName()}`},
  audioOnly: {
    title: 'Audio only example',
    href: `/audio-only?user=${faker.person.fullName()}`,
  },
  customize: {
    title: 'Simple example with custom components',
    href: `/customize?user=${faker.person.fullName()}`,
  },
  clubhouse: {
    title: 'Clubhouse clone build with LiveKit components',
    href: `/clubhouse?user=${faker.person.fullName()}`,
  },
} as const;

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