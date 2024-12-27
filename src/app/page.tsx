import { Advantages } from "@/widgets/Advantages";
import { Introduction } from "@/widgets/Introduction";
import { PortfolioExample } from "@/widgets/PortfolioExample";
import { Reviews } from "@/widgets/Reviews";

export default function Home() {
  return (
    <div className="">
      <Introduction/>
      <Advantages/>
      <Reviews/>
      <PortfolioExample/>
    </div>
  );
}
