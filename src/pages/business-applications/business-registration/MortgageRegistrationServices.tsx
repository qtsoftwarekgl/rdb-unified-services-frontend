import { Accordion } from "@radix-ui/react-accordion";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/Accordion";
import { Link } from "react-router-dom";

const MortgageRegistrationServices = () => {
  return (
    <main className="flex flex-col w-full">
      <Accordion type="single" collapsible className="p-8 ">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-bold ">
            Immovable
          </AccordionTrigger>
          <AccordionContent className="relative border-none">
            <div className="grid grid-cols-1 gap-4 p-4 mb-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="relative flex flex-col gap-8 pl-8">
                <div className="absolute inset-x-0 w-2 h-24 top-6 bg-[#85b1d6]"></div>
                <Link to="/immovable-collateral">
                  <span>Immovable Collateral Registration</span>
                </Link>
                <Link to="/pari-passu">
                  <span>Pari Passu</span>
                </Link>
                <Link to="/default-notice">
                  <span>Default Notice</span>
                </Link>
                <Link to="/deregistration">
                  <span>Request for Deregistration </span>
                </Link>
              </div>
              <div className="relative flex flex-col gap-8 pl-8">
                <div className="absolute inset-x-0 w-2 h-24 top-6 bg-[#85b1d6]"></div>
                <Link to="/change-particulars">
                  <span>Change of Particulars</span>
                </Link>
                <Link to="/foreign-company-registration">
                  <span>Transfer of Mortgage</span>
                </Link>
                <Link to="/transfer-mortgage">
                  <span>Enterprise Registration </span>
                </Link>
                <Link to="/cancel-receivership">
                  <span>Cancellation of receivership process</span>
                </Link>
              </div>
              <div className="relative flex flex-col gap-8 pl-8">
                <div className="absolute inset-x-0 w-2 h-24 top-6 bg-[#85b1d6]"></div>
                <Link to="/receivership-sale">
                  <span>Receivership (sale)</span>
                </Link>
                <Link to="/receivership-possession">
                  <span>Receivership (possession)</span>
                </Link>
                <Link to="//receivership-manage">
                  <span>Receivership (manage)</span>
                </Link>
                <Link to="//receivership-lease">
                  <span>Receivership (lease)</span>
                </Link>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default MortgageRegistrationServices;
