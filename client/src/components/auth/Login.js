import React, { useState } from "react";
// React router dom
import { useNavigate } from "react-router-dom";
// Utils
import { toastify } from "../../utils/notificationUtils";
// Context
import { useChatContext } from "../../context/ChatProvider";
// Chakra UI
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";

const Login = () => {
  //Local states
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // Global states
  const { setUserState, config, setConfigHeaders } = useChatContext();
  const navigate = useNavigate();

  // Handle the show of the password
  const handleClick = () => setShow(!show);

  // Log in the user
  const submitHandler = async (
    e,
    userEmail = email,
    userPassword = password
  ) => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/login", {
        method: "POST",
        ...config,
        body: JSON.stringify({ email: userEmail, password: userPassword }),
      });
      const { error, user } = await res.json();
      if (error) {
        toastify(error, "error");
      } else {
        toastify("Registration successful", "success");
        setConfigHeaders(user.token);
        setUserState(user);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/chats");
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
        onClick={(e) => submitHandler(e, "guest@example.com", "123456")}
        isLoading={loading}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
