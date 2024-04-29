import { Link } from "react-router-dom";
import Input from "../../components/inputs/Input";
import Navbar from "../../containers/Navbar";
import BusinessRegistrationServices from "../business-registration/BusinessRegistrationServices";
import { useState } from "react";
import MortgageRegistrationServices from "../business-registration/MortgageRegistrationServices";
import { defaultSections } from "../../constants/home";

const Home = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const tabs = [
    {
      no: 1,
      name: "Business Registration Services",
    },
    {
      no: 2,
      name: "Mortgage Registration Services",
    },
  ];

  function searchInSectionData(query: string) {
    const matches = [];
    const queryLowerCase = query.toLowerCase();

    for (let i = 0; i < defaultSections.length; i++) {
      const section = defaultSections[i];
      const sectionMatches = {
        title: section.title,
        links: [],
      };

      if (section.title.toLowerCase().includes(queryLowerCase)) {
        matches.push(sectionMatches);
      }

      const linkMatches = [];
      for (let j = 0; j < section.links.length; j++) {
        const links = section.links[j];
        for (let k = 0; k < links.length; k++) {
          const link = links[k];
          if (link.label.toLowerCase().includes(queryLowerCase)) {
            linkMatches.push(link);
          }
        }
      }

      if (linkMatches.length > 0) {
        sectionMatches.links.push(linkMatches as never);
        if (!section.title.toLowerCase().includes(queryLowerCase)) {
          matches.push(sectionMatches);
        }
      }
    }

    return matches.length > 0 ? matches : [];
  }

  const filteredSections =
    (searchQuery && searchInSectionData(searchQuery)) || defaultSections;

  const registrationServices = [
    {
      component: <BusinessRegistrationServices sections={filteredSections} />,
    },
    { component: <MortgageRegistrationServices /> },
  ];

  return (
    <main className="relative">
      <Navbar className="!w-full !left-0 !px-12" />
      <section className="absolute w-full h-full top-[2vh]">
        <section className="flex flex-col items-center justify-center w-full gap-8 py-32 bg-primary">
          <div>
            <h1 className="text-5xl font-bold leading-tight text-center text-white">
              Register your
            </h1>
            <h1 className="text-5xl font-bold leading-tight text-white">
              business on a click.
            </h1>
          </div>
          <Input
            className=" !w-[40%] self-center !rounded-full !py-4 !px-8"
            type="text"
            placeholder="Search service ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </section>
        <section className="max-w-[1500px] p-8 mx-auto">
          <nav className="flex items-center gap-4">
            {tabs.map((tab, index) => {
              const selected = activeTab === tab?.no;
              return (
                <Link
                  key={index}
                  to={"#"}
                  className={` w-1/2 rounded text-center p-6 ${
                    selected
                      ? "bg-primary text-white shadow-xl"
                      : "border border-primary"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab.no);
                  }}
                >
                  <span className="text-lg font-bold">{tab.name}</span>
                </Link>
              );
            })}
          </nav>
          <menu className="flex items-center w-full gap-5">
            {registrationServices[activeTab - 1]?.component}
          </menu>
          {filteredSections.length === 0 && (
            <main className="flex justify-center items-center flex-col w-full mx-auto rounded-md p-12 mt-12  max-w-[600px] border-primary">
              <h1 className="text-2xl text-red-500">Service Not Found!</h1>
            </main>
          )}
        </section>
      </section>
    </main>
  );
};

export default Home;
