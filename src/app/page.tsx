import { Advantages } from "@/widgets/Advantages";
import { Feedback } from "@/widgets/Feedback";
import { Introduction } from "@/widgets/Introduction";
import { PortfolioExample } from "@/widgets/PortfolioExample";
import { Reviews } from "@/widgets/Reviews";
import { SubscriptionPlans } from "@/widgets/Subscribe";

export default function Home() {
  return (
    <div className="">
      <Introduction/>
      <Advantages/>
      <Reviews/>
      <PortfolioExample/>
      {/* <Feedback/> */}
      <SubscriptionPlans/>
    </div>
  );
}
