import SheetdataComponent from "@/components/SheetdataComponent";
import SheetDetailbar from "@/components/SheetDetailsbar";

export const SheetData = ({ selectedSheet, parentCompRefresh }) => {
  return (
    <>
      {" "}
      {/* Sheet Details Sidebar */}
      {<SheetDetailbar selectedSheet={selectedSheet} />}
      {/* Main Content Area */}
      {<SheetdataComponent selectedSheet={selectedSheet} />}
    </>
  );
};
