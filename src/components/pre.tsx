import type React from 'react';

const Pre: React.FC<{
  data: any;
}> = ({ data }) => {
  return (
    <details>
      <summary>View data</summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  );
};

export default Pre;
