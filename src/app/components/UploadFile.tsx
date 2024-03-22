import { Button, Text } from "@tremor/react";
import { FaRandom } from "react-icons/fa";
import { SiMicrosoftexcel } from "react-icons/si";
import { BsFiletypeJson } from "react-icons/bs";
import React from "react";
import { UploadFileProps } from "@/app/types/interface";
import { exampleJsonFormatted } from "@/data/subFlowData";
import { Edge, Node } from "reactflow";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@tremor/react";
import { UploadExcel } from "@/app/components/uploadFile/UploadExcel";
import { UploadJson } from "@/app/components/uploadFile/UploadJson";

const UploadFile: React.FC<UploadFileProps> = ({
  setJsonData,
  closeModal,
  setJsonFormattedData,
}) => {
  const handleExampleDataUpload = (exampleJsonFormatted: {
    nodes: Node[];
    edges: Edge[];
  }) => {
    setJsonFormattedData(exampleJsonFormatted);
    closeModal();
  };

  return (
    <div className="upload-container h-[380px] flex flex-col justify-between items-center">
      <TabGroup className="tab-group">
        <TabList className="">
          <Tab icon={BsFiletypeJson}>Json File</Tab>
          <Tab icon={SiMicrosoftexcel}>Excel file</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="pt-4 flex items-center flex-col justify-between  h-[230px]">
              <UploadJson
                closeModal={closeModal}
                setJsonFormattedData={setJsonFormattedData}
              />
            </div>
          </TabPanel>
          <TabPanel className="">
            <div className="pt-4 flex items-center flex-col justify-between h-[230px]">
              <UploadExcel closeModal={closeModal} setJsonData={setJsonData} />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <div className="flex justify-between flex-col items-center h-[80px]">
        <Text>Or</Text>
        <div>
          <Button
            icon={FaRandom}
            onClick={() => handleExampleDataUpload(exampleJsonFormatted)}
          >
            Start with example data and modify it
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
