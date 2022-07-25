import React from "react";
// Chakra UI
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModel = ({ user, children }) => {
  // Modal disclosure
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          style={{ display: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal
        size={{ base: "xs", sm: "md", md: "lg" }}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <ModalContent h="410px">
          {/* Modal title- user name*/}
          <ModalHeader
            mt={3}
            fontSize={{ base: "30px", sm: "40px" }}
            fontFamily="Work sans"
            style={{ display: "flex" }}
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />

          {/* Modal Body */}
          <ModalBody
            style={{ display: "flex" }}
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            {/* User image */}
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />

            {/* User email */}
            <Text
              fontSize={{ base: "20px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          {/* Modal footer */}
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModel;
