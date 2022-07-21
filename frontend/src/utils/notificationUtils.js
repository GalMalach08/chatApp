import { createStandaloneToast } from "@chakra-ui/toast";
const { toast } = createStandaloneToast();

export const toastify = (title, status, position = "bottom", description) => {
  toast({
    title: title,
    ...(description && { description }),
    status: status,
    duration: 3000,
    position,
    isClosable: true,
  });
};
