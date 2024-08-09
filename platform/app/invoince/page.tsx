"use client"
import { ChangeEvent, useState } from "react";
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import axios from "axios";

type AttestationResponse = {
    iban: string;
    amount: string;
    currency: string;
};

const Invoince = () => {
    const [smartContract, setSmartContract] = useState("")
    const [base64, setBase64] = useState('');
    const [attestationUID, setAttestationUID] = useState<string>('');

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {

        try {
            //Send request to API route
            const response = await axios.post<AttestationResponse>('/api/attest', {
                trade_contract_address: smartContract,
                base64
            });

            //const { iban, amount, currency } = response.data; // Hardcoded for now
            const iban = response.data.iban;
            const amount = response.data.amount;
            const currency = response.data.currency;

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

        <div className="relative h-screen overflow-x-auto mt-10 mb-10 text-white">
            <div className="mb-10 md:mb-16">
                <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Please Upload Your Receipt</h2>
            </div>

            <div className="mb-5">
                <label htmlFor="erc20" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Your Trade Contract Address</label>
                <input
                    value={smartContract}
                    onChange={(event) => setSmartContract(event.target.value)}
                    name="erc20" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
            </div>

            <div>
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input onChange={handleImageUpload} id="dropzone-file" type="file" className="hidden" />
                </label>
            </div>

            <button onClick={handleSubmit} className="block mt-5 w-full rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base">Upload</button>

        </div>

    )
}

export default Invoince;