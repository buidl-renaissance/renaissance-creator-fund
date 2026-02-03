import React from "react";
import Head from "next/head";
import Splash from "@/components/Splash";
import { useUser } from "@/contexts/UserContext";
import { creationCycleConfig } from "@/config/creationCycle";

export const getServerSideProps = async () => {
  return {
    props: {
      metadata: {
        title: `Enter | ${creationCycleConfig.name}`,
        description: `${creationCycleConfig.name} - ${creationCycleConfig.tagline}`,
      },
    },
  };
};

const AppEntryPage: React.FC = () => {
  const { user, isLoading } = useUser();

  return (
    <>
      <Head>
        <title>Enter | {creationCycleConfig.name}</title>
        <meta name="description" content={`${creationCycleConfig.name} - ${creationCycleConfig.tagline}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Splash
        user={user}
        isLoading={isLoading}
        appName={creationCycleConfig.name}
        logoAccent={creationCycleConfig.tagline}
      />
    </>
  );
};

export default AppEntryPage;
