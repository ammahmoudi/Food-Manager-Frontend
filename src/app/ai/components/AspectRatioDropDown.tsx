import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

interface AspectRatioDropDownProps {
  onSelect: (aspectRatio: string) => void; // Prop to pass selected aspect ratio to the parent component
}

const AspectRatioDropDown: React.FC<AspectRatioDropDownProps> = ({ onSelect }) => {
  const aspectRatios = [
    {
      key: "1:1",
      label: "Square (1:1)",
    },
    {
      key: "16:9",
      label: "Portrait (16:9)",
    },
    {
      key: "3:2",
      label: "Landscape (3:2)",
    }
  ];

  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>("");

  const handleSelect = (key: string) => {
    setSelectedAspectRatio(key); // Update state with selected aspect ratio
    onSelect(key); // Pass the selected aspect ratio to the parent component
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" color="warning">
          {selectedAspectRatio ? `Aspect Ratio: ${selectedAspectRatio}` : "Choose Aspect Ratio"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Aspect Ratio" items={aspectRatios}>
        {(item) => (
          <DropdownItem
            key={item.key}
            color="warning"
            onClick={() => handleSelect(item.key)} // Handle the selection
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default AspectRatioDropDown;





//  Usage  //


// const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>("");


{/*



const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>("");



const handleAspectRatioSelect = (aspectRatio: string) => {
  setSelectedAspectRatio(aspectRatio);
  console.log("Selected aspect ratio:", aspectRatio);



  <div className="p-4">
<h2 className="text-xl font-semibold mb-4">Select Aspect Ratio</h2>
<AspectRatioDropDown onSelect={handleAspectRatioSelect} />
{selectedAspectRatio && (
  <p className="mt-4">Chosen Aspect Ratio: {selectedAspectRatio}</p>
)}
</div>



*/}