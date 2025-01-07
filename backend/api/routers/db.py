from fastapi import APIRouter, Depends, HTTPException, Query

router = APIRouter(tags=["db"])


@router.get("/")
async def read_root():
    return {"Hello": "World"}


@router.get("/items/")
async def read_items(q: str = Query(None)):
    if q:
        return {"q": q}
    return {"q": "None"}
