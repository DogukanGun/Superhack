// app/test-attestation/index.tsx

import Head from 'next/head';
import AttestationForm from '../../components/forms/AttestationForm';

const TestAttestation: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Test Attestation</title>
      </Head>
      <h1>Test Attestation</h1>
      <AttestationForm />
    </div>
  );
};

export default TestAttestation;
