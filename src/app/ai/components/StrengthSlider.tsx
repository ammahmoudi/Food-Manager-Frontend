import { useState } from "react";
import { Slider, SliderValue } from "@nextui-org/react";

interface LoraUsageSliderProps {
  defaultValue?: number;
  onValueChange: (value: number) => void;
  label: string;
}

const LoraUsageSlider: React.FC<LoraUsageSliderProps> = ({
  defaultValue = 80,
  onValueChange,
  label,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(defaultValue);

  // Handle slider value change
  const handleSliderChange = (value: SliderValue) => {
    setSliderValue(value as number);
    onValueChange((value as number) / 100);
  };

  return (
    <div className="flex flex-col gap-4 ">
      <Slider
        size="sm"
        value={sliderValue}
        defaultValue={defaultValue}
        onChange={handleSliderChange}
        maxValue={100}
        step={1}
        label={label}
        className="p-1"
        classNames={{
          base: "gap-3",
          track: "border-s-secondary-100",
          filler: "bg-gradient-to-r from-secondary-100 to-secondary-500",
        }}
        renderThumb={(props) => (
          <div
            {...props}
            className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
          >
            <span className="transition-transform bg-gradient-to-br shadow-small from-secondary-100 to-secondary-500 rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80" />
          </div>
        )}
      />
    </div>
  );
};

export default LoraUsageSlider;




//  ---------------------- Usage ON OTHER PAGES ---------------------- //




// .     const handleValueChange = (value: number) => {console.log("Lora usage value:", value);};


{/*
<div>
  <LoraUsageSlider 
    label=""
      onValueChange={handleValueChange} 
  />
</div> 
*/}

