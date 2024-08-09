// components/AttestationForm.tsx
"use client"
import { useState, FormEvent } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';

type AttestationResponse = {
  iban: string;
  amount: string;
  currency: string;
};

const AttestationForm: React.FC = () => {
  const [tradeContractAddress, setTradeContractAddress] = useState<string>('');
  const [invoice, setInvoice] = useState<string>('');
  const [attestationUID, setAttestationUID] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      // Send request to API route
      //   const response = await axios.post<AttestationResponse>('/api/verify', {
      //     trade_contract_address: tradeContractAddress,
      //     invoice
      //   });

      //const { iban, amount, currency } = response.data; // Hardcoded for now
      const iban = "DE15 0000 0000 0000 0000 00";
      const amount = "100.00";
      const currency = "EUR";

      // Set up EAS
      const easContractAddress = '0x4200000000000000000000000000000000000021';
      const schemaUID = '0xeca168efa37281d63315562fecb4af364354d524e7bbe71007d35134dcd9ac3a';
      const eas = new EAS(easContractAddress);

      // Initialize ethers signer (replace with your signer)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      await eas.connect(signer);

      // Initialize SchemaEncoder with the schema string
      const schemaEncoder = new SchemaEncoder('string iban,string amount,string currency');
      const encodedData = schemaEncoder.encodeData([
        { name: 'iban', value: iban, type: 'string' },
        { name: 'amount', value: amount, type: 'string' },
        { name: 'currency', value: currency, type: 'string' }
      ]);

      // Create attestation
      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: '0x0000000000000000000000000000000000000000',
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();
      //const newAttestationUID = receipt.events[0].args.uid;
      setAttestationUID(newAttestationUID);

      console.log('New attestation UID:', newAttestationUID);
    } catch (error) {
      console.error('Failed to create attestation:', error);
    }
  };

  return (
    <div className="bg-white text-black py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
      <div className="mx-auto max-w-lg rounded-lg border">

        <form className="flex flex-col gap-4 p-4 md:p-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="erc20" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Trade Contract Address</label>
            <input
              value={tradeContractAddress}
              onChange={(e) => setTradeContractAddress(e.target.value)}
              name="erc20" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
          </div>
          <div>
            <label htmlFor="erc20" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Invoice (Base64)</label>
            <input
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              name="erc20" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
          </div>
          <button type="submit" className="block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">Verify and Attest</button>

          <button ></button>
          {attestationUID && <p className='text-black'>New Attestation UID: {attestationUID}</p>}
        </form>
        </div>
      </div>
    </div>
  );
};

export default AttestationForm;
