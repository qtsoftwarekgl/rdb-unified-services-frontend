import { TabType } from "@/types/navigationTypes";

interface Props {
  tabs: TabType[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void; 
}

const CustomTab = ({ tabs, activeTab, setActiveTab }: Props) => {
  return (
    <div className="w-full flex gap-2">
      {tabs.map((tab) => (
        <div
          key={tab.name}
          onClick={() => setActiveTab(tab)}
          className={`cursor-pointer flex-grow text-[14px] font-semibold text-center py-2 rounded-md ${
            tab.name === activeTab.name
              ? "bg-primary text-white"
              : "bg-white text-primary border border-primary"
          }`}
          style={{ flexBasis: `${100 / tabs.length}%` }} // Ensure each tab takes up equal space
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default CustomTab;
