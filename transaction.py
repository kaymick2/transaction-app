from fastapi import APIRouter, Path, HTTPException, status
from model import Transaction,transactReq 
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

transaction_router = APIRouter()

transactionList = []
max_id: int = 0


@transaction_router.post("/transactions", status_code=status.HTTP_201_CREATED)
async def add_transaction(transaction: transactReq) -> dict:
    global max_id
    max_id += 1  # auto increment ID
#somethign tells me line 17 is gonna be wrong but thats just me.
#you might need to have the var names match the transaction class attributes
    newTransaction = Transaction(id=max_id, 
                                 date=transaction.date,
                                whoTrans=transaction.whoTrans,
                                  payWho=transaction.whoTrans,
                                    transAmount=transaction.transAmount,
                                      transType=transaction.transType,
                                        paid=transaction.paid,
                                          forWhat=transaction.forWhat,
                                            confNum=transaction.confNum
                                )
    transactionList.append(newTransaction)
    json_compatible_item_data = newTransaction.model_dump()
    return JSONResponse(json_compatible_item_data, status_code=status.HTTP_201_CREATED)


@transaction_router.get("/transactions")
async def obtainTransactions() -> dict:
    json_compatible_item_data = jsonable_encoder(transactionList)
    return JSONResponse(content=json_compatible_item_data)


@transaction_router.get("/transactions/{id}")
async def get_transaction_by_id(id: int = Path(..., date="default")) -> dict:
    for transaction in transactionList:
        if transaction== id:
            return {"Transaction": transaction}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"The transaction with ID={id} is not found.",
    )


@transaction_router.put("/transactions/{id}")
async def update_transaction(Transaction: transactReq, id: int) -> dict:
    for x in transactionList:
        if x.id == id:
            x.title = Transaction.date
            x.whofor = Transaction.whoTrans
            x.whopay= Transaction.payWho
            x.amount=Transaction.transAmount
            x.ttype=Transaction.transType
            x.isPaid=Transaction.paid
            x.what=Transaction.forWhat
            x.confirmation=Transaction.confNum
            return {"Message": "Transaction updated successfully"}

    return {"message": f"The transaction with ID={id} was not found."}


@transaction_router.delete("/transactions/{id}")
async def delete_transaction(id: int) -> dict:
    for i in range(len(transactionList)):
        transaction = transactionList[i]
        if transaction.id == id:
            transactionList.pop(i)
            return {"message": f"The transaction with ID={id} has been deleted."}

    return {"message": f"The transaction with ID={id} is not found."}
