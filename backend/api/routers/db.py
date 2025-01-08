from fastapi import APIRouter, Depends, HTTPException, Query
import os
from supabase import create_client, Client
from src.findBets import OddsArbitrageFinder
url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)


router = APIRouter(tags=["db"])


@router.get("/")
async def read_root():
    return {"Hello": "World"}


@router.get("/items/")
async def read_items(q: str = Query(None)):
    if q:
        return {"q": q}
    return {"q": "None"}
