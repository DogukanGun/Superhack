import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type VerifyResponse = {
  iban: string;
  amount: string;
  currency: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { trade_contract_address, invoice } = req.body;

    try {
      const response = await axios.post<VerifyResponse>('http://0.0.0.0:8080/verify', {
        trade_contract_address,
        invoice
      });

      const { iban, amount, currency } = response.data;

      res.status(200).json({ iban, amount, currency });
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify bank transfer' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
