from fastapi import APIRouter, Depends, HTTPException, Query
import os
from supabase import create_client, Client
from ...src.findBets import OddsArbitrageFinder
from datetime import datetime, timezone


url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

router = APIRouter(tags=["db"])


@router.get("/")
async def read_root():
    return {"Hello": "World"}

@router.put("/update-db")
async def update_db():
    api_key = os.environ.get("ODDS_API_KEY")
    arbitrage_finder = OddsArbitrageFinder(api_key)
    data = arbitrage_finder.run_update_db()

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    arbitrage_df = data[0]
    plus_ev_df = data[1]

    print(arbitrage_df)
    print(plus_ev_df)

    return {"timestamp": timestamp, "arbitrage_df": arbitrage_df, "plus_ev_df": plus_ev_df}

@router.get("/items/")
async def read_items(q: str = Query(None)):
    if q:
        return {"q": q}
    return {"q": "None"}
