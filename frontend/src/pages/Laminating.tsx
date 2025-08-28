
import { ServicePage } from "@/components/ServicePage";

const Laminating = () => {
  return (
    <ServicePage 
      title="Laminating"
      description="Protect your important documents and photos."
      image="/laminating.png"
      details={[
        "Preserve and protect your important documents with our professional laminating services at Studio Arunaseya.",
        "We offer lamination in various thicknesses and sizes to suit different types of documents, from ID cards to certificates.",
        "Our high-quality lamination provides protection against water damage, tears, creases, and general wear and tear.",
        "The lamination process enhances the durability of documents without compromising their readability or appearance.",
        "We can laminate photos, certificates, business cards, menus, instructional materials, and more."
      ]}
      pricing="Starts at Rs. 100 for small items (card size). Larger documents priced by size."
      turnaround="Ready in 15-30 minutes for standard items."
    />
  );
};

export default Laminating;
