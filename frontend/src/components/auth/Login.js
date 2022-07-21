import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useHistory } from "react-router-dom";
import { config } from "../../utils/userUtils";
import { useToast } from "@chakra-ui/react";
import { useChatContext } from "../../context/ChatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUserState } = useChatContext();
  const toast = useToast();

  const history = useHistory();

  const submitHandler = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/login", {
        method: "POST",
        ...config,
        body: JSON.stringify({ email, password }),
      });
      const { error, user } = await res.json();
      if (error) {
        toast({
          title: error,
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        toast({
          title: "Registration successful",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setUserState(user);
        localStorage.setItem("user", JSON.stringify(user));
        history.push("/chats");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px">
      {/* Email */}
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      {/* Submit Button */}
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
        isDisabled={!email || !password ? true : false}
      >
        Login
      </Button>

      {/* Get Guest Credentials */}
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
          submitHandler();
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
