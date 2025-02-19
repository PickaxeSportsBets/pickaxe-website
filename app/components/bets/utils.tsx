import betmgm from "@/public/images/betmgm-logo.png";
import betRivers from "@/public/images/betrivers-logo.png";
import caesars from "@/public/images/caesars-logo.png";
import dk from "@/public/images/draftkings-logo.png";
import espn from "@/public/images/espnbet-logo.png";
import fanduel from "@/public/images/fanduel-logo.png";
import hardrockBet from "@/public/images/hardrockbet-logo.png";
import pinnacle from "@/public/images/pinnacle-logo.png";
import underDog from "@/public/images/underdog-logo.png";
import ESPNBet from "@/public/images/espnBet.jpg";
import Fliff from "@/public/images/fliff.webp";
import Fanatics from "@/public/images/fanatics.webp";
import { createClient } from "@/app/utils/supabase/client";

const BookmakerLogos: { [key: string]: any } = {
  betmgm: betmgm,
  betrivers: betRivers,
  caesars: caesars,
  draftkings: dk,
  fanduel: fanduel,
  "hard rock bet": hardrockBet,
  pinnacle: pinnacle,
  underdog: underDog,
  "espn bet": ESPNBet,
  fliff: Fliff,
  fanatics: Fanatics,
};

export default BookmakerLogos;
