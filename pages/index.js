import Head from 'next/head';

import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';
import { Fragment } from 'react';

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>Donizildo Collection</title>
        <meta
          name="description"
          content="Browse a huge list of highly activate React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
};

// export async function getServerSideProps(context) {

//   const req = context.req;
//   const res = context.res;

//   // Fetch data from API or Filesystem, Allways Run in the server not in the client!
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   };
// };

export async function getStaticProps() {
  // USED To enhance SEO Optiomization since it will mount the page with the props when it loads
  // * More usefull for comercial webpages ! *

  // Fetch data from an API ...
  // Read Files from a filesystem ... Etc.

  const client = await MongoClient.connect(
    'mongodb+srv://ibsenriou:1234567812@cluster0.y4scqt9.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 3600,
  };
}

export default HomePage;
