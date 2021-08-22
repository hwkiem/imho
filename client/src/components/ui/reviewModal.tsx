import {
  Button,
  chakra,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { ReviewForm } from "../forms/review";
import { RiAddCircleFill } from "react-icons/ri";

export default function ReviewModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        onClick={onOpen}
        position={"absolute"}
        zIndex={2}
        top={"50%"}
        left={"80%"}
        rightIcon={<Icon as={chakra(RiAddCircleFill)} />}
        colorScheme="teal"
        variant="solid"
        px={4}
        boxShadow={"2xl"}
        rounded={"md"}
      >
        Write Review!
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ReviewForm />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
