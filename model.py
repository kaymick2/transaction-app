from pydantic import BaseModel


class Transaction(BaseModel):
    id: int
    date: str
    whoTrans: str
    payWho: str
    transAmount: float
    transType: str
    paid: str
    forWhat: str
    confNum:str


class transactReq(BaseModel):
    date: str
    whoTrans: str
    payWho: str
    transAmount: float
    transType: str
    paid: str
    forWhat: str
    confNum:str
    
