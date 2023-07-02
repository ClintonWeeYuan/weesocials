import type {NextPage} from 'next';
import Head from 'next/head';
import {faker} from '@faker-js/faker';
import Link from 'next/link';
import {useState} from "react";

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
  const [name, setName] = useState("");

  return (
    <div>
      <Head>
        <title>Wee Socials</title>
        <meta name="description" content=""/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className="h-screen w-screen flex justify-center items-center">
        <div className="flex flex-col md:flex-row">
          <input type="text" placeholder="Your name..." onChange={(e) => {setName(e.currentTarget.value)}} className="input input-accent w-full max-w-xs"/>

          <Link href={`/customize?user=${name}`} className="btn btn-accent ml-0 mt-2 md:mt-0 md:ml-2">Enter Room </Link>

        </div>
        {/*<ul className="bg-yellow-500 h-full">*/}
        {/*  {Object.values(EXAMPLE_ROUTES).map(({ title, href }, index) => {*/}
        {/*    return (*/}
        {/*      <li className={styles.listItem} key={index}>*/}
        {/*        <a className={styles.link} href={href}>*/}
        {/*          {title}*/}
        {/*        </a>*/}
        {/*      </li>*/}
        {/*    );*/}
        {/*  })}*/}
        {/*</ul>*/}
      </main>
    </div>
  );
};

export default Home