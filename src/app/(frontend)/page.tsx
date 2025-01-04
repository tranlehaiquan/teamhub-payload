import { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return {
    title: `TeamHub`,
  };
}

const HomePage = () => {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default HomePage;
