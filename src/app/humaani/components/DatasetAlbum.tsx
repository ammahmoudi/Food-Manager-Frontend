import React from "react";
import Dataset from "../interfaces/Dataset";
import ImageComponent from "./ImageComponent";
import { Button, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, Link, Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";


interface DatasetAlbumProps {
  dataset: Dataset;
}

const DatasetAlbum: React.FC<DatasetAlbumProps> = ({ dataset }) => {

  return (
    <Card
    isBlurred
    className="border-none bg-background/60 dark:bg-default-100/50"
    shadow="sm">
      <CardHeader className="flex flex-row flex-grow justify-between">
        <div className="flex flex-col gap-1" >
            <Link href={`/humaani/datasets/${dataset.id}`}>
                <p className="text-md text-black font-bold">
                  {dataset.name} (ID: {dataset.id})
                </p>
            </Link>
            <div className="px-3 py-0 text-small">
              <p className="text-sm mb-4">
                  Created At: {new Date(dataset.created_at).toLocaleString()}
              </p>
            </div>
        </div>
        <Dropdown  backdrop="blur">
              <DropdownTrigger>
                <Button isIconOnly color="danger" variant="light" size="lg">
                  <HiDotsVertical />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="rename"
                  className="text-success"
                  color="success"
                  startContent={<MdDriveFileRenameOutline />}
                >
                  Rename dataset
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<FaRegTrashAlt />}
                >
                  Delete dataset
                </DropdownItem>
              </DropdownMenu>
          </Dropdown>
      </CardHeader>
      <Divider/>

      <CardBody>

      {dataset.images && dataset.images.length > 0 ? (
    dataset.images.map((imageId) => (
      <div key={imageId} className="w-40 h-40">
        <ImageComponent src_id={imageId} src_variant="datasetImage" />
      </div>
    ))
  ) : dataset.jobs && dataset.jobs.length > 0 ? (
    dataset.jobs.map((jobId) => (
      <ImageComponent className="w-40 h-40" key={jobId} src_id={jobId} src_variant="job"  />
    ))
  ) : (
    <p>No images or jobs available in this dataset.</p>
  )}






      </CardBody>

    </Card>

  );
};

export default DatasetAlbum;







// <div className="flex flex-wrap gap-4 transparent">

  // {dataset.images && dataset.images.length > 0 ? (
  //   dataset.images.map((imageId) => (
  //     <div key={imageId} className="w-40 h-40">
  //       <ImageComponent src_id={imageId} src_variant="datasetImage" />
  //     </div>
  //   ))
  // ) : dataset.jobs && dataset.jobs.length > 0 ? (
  //   dataset.jobs.map((jobId) => (
  //     <ImageComponent className="w-40 h-40" key={jobId} src_id={jobId} src_variant="job"  />
  //   ))
  // ) : (
  //   <p>No images or jobs available in this dataset.</p>
  // )}
// </div>


