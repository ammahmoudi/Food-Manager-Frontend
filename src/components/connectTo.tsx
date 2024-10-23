import { Button, link } from "@nextui-org/react";
import { FaLinkedin, FaInstagram, FaTelegram } from 'react-icons/fa';
import { RiMailSendLine } from "react-icons/ri";
import { FaGithub } from "react-icons/fa6";




const connectTo: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 text-center">
      <p className="text-lg mb-4">Created and designed by Soheil and AmirHossein</p>

      <div className="flex justify-center space-x-4 mb-4">
          <Button as={link}
            isIconOnly
            href=""
          >
            <FaTelegram/>
          </Button>

          <Button as={link}
            isIconOnly
            href=""
          >
            <FaLinkedin/>
          </Button>

          <Button as={link}
            isIconOnly
            href=""
          >
            <FaInstagram/>
          </Button>

          <Button as={link}
            isIconOnly
            href=""
          >
            <RiMailSendLine/>
          </Button>

          <Button as={link}
            isIconOnly
            href=""
          >
            <FaGithub/>
          </Button>
      </div>
    </footer>
  );
};

export default connectTo;
