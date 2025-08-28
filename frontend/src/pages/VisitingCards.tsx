
import { ServicePage } from "@/components/ServicePage";

const VisitingCards = () => {
  return (
    <ServicePage 
      title="Visiting Card Printing"
      description="Design. Print. Impress."
      image="/visiting_card.png"
      details={[
        "Make lasting impression with professionally designed and printed visiting cards from Studio Arunaseya.",
        "We offer a comprehensive service that includes design consultation, layout creation, and high-quality printing.",
        "Choose from a variety of paper stocks, finishes, and special effects like embossing, foil stamping, or spot UV coating.",
        "Our designers can create a visiting card that reflects your personal brand or business identity, with attention to typography, color, and overall aesthetics.",
        "We provide digital proofs for your approval before printing to ensure your complete satisfaction with the final product."
      ]}
      pricing="Starting at Rs.1500 for 100 standard cards. Premium finishes and special effects available at additional cost."
      turnaround="Standard cards ready in 24-48 hours. Rush orders available."
    />
  );
};

export default VisitingCards;
