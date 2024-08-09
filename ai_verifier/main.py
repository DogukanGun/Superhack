import base64
import json
import os

from fastapi import FastAPI
import ollama
from pydantic import BaseModel

app = FastAPI()


class VerifierBank(BaseModel):
    trade_contract_address: str
    invoice: str


@app.post("/verify")
async def verify_bank_transfer(
        verify_bank_transfer_obj: VerifierBank
):
    image_data = base64.b64decode(verify_bank_transfer_obj.invoice)
    file_path = "./invoice.jpg"

    # Save base64 image into server for llava
    with open(file_path, "wb") as image_file:
        image_file.write(image_data)

    # Ask llava model to extract information
    res = ollama.chat(
        model='llava',
        messages=[{
            "role": 'system',
            "content": 'Check the image and find receiver IBAN and the amount. '
                       'Then return message in this format { iban:string, amount:number, currency:string }',
            "images": ['./invoice.jpg']
        }]
    )

    # Delete the image file
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"Image {file_path} deleted successfully.")
    else:
        print(f"The file {file_path} does not exist.")

    # Extract the information from the response
    extracted_info = json.loads(res["message"]["content"])

    # Convert the extracted information to the required format
    iban = extracted_info['iban']
    amount = extracted_info['amount']
    currency = extracted_info['currency']

    # TODO Call function in smart contract to check the transfer
    return {
        "message": "Transfer verified and attestation created",
        "iban": iban,
        "amount": amount,
        "currency": currency
    }


if __name__ == "__main__":
    import uvicorn
    from os import getenv

    host = getenv("HOST", "0.0.0.0")
    port = int(getenv("PORT", "8080"))  # Default port is 8080 if not specified
    uvicorn.run(app, host=host, port=port)
