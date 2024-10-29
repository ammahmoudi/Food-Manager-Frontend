import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

interface AspectRatioDropDownProps {
  onSelect: (aspectRatio: string) => void; // Prop to pass selected aspect ratio to the parent component
}

const AspectRatioDropDown: React.FC<AspectRatioDropDownProps> = ({ onSelect }) => {
  const aspectRatios = [
    { key: "1:1", label: "1:1" },
    { key: "2:3", label: "2:3" },
    { key: "3:4", label: "3:4" },
    { key: "5:8", label: "5:8" },
    { key: "9:16", label: "9:16" },
    { key: "9:19", label: "9:19" },
    { key: "9:21", label: "9:21" },
    { key: "3:2", label: "3:2" },
    { key: "4:3", label: "4:3" },
    { key: "8:5", label: "8:5" },
    { key: "16:9", label: "16:9" },
    { key: "19:9", label: "19:9" },
    { key: "21:9", label: "21:9" }
  ];

  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>("");

  const handleSelect = (key: string) => {
    setSelectedAspectRatio(key); // Update state with selected aspect ratio
    onSelect(key); // Pass the selected aspect ratio to the parent component
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="solid" color="secondary">
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