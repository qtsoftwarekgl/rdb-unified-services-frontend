import { Accordion } from "@radix-ui/react-accordion";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/Accordion";
import { Link } from "react-router-dom";

interface Section {
  title: string;
  links: { to: string; label: string }[][];
}

interface Props {
  sections: Section[];
}

const BusinessRegistrationServices: React.FC<Props> = ({ sections }) => {
  // Render each accordion section
  const renderAccordionSections = () => {
    return sections.map((section, index) => (
      <Accordion key={index} type="single" collapsible className="p-8">
        <AccordionItem value={`item-${index + 1}`}>
          <AccordionTrigger className="text-xl font-bold">
            {section.title}
          </AccordionTrigger>
          <AccordionContent className="relative border-none">
            <div className="grid grid-cols-1 gap-4 p-4 mb-8 md:grid-cols-2 lg:grid-cols-3">
              {section.links.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="relative flex flex-col gap-8 pl-8"
                >
                  <div className="absolute inset-x-0 w-2 h-28 top-6 bg-[#85b1d6]"></div>
                  {group.map((link, linkIndex) => (
                    <Link key={linkIndex} to={link.to}>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ));
  };

  return (
    <main className="flex flex-col w-full">{renderAccordionSections()}</main>
  );
};

export default BusinessRegistrationServices;
