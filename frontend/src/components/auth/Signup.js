import React, { useEffect, useState } from "react";
// React router dom
import { useHistory } from "react-router-dom";
// Utils
import { config } from "../../utils/userUtils";
import { toastify } from "../../utils/notificationUtils";
// Context
import { useChatContext } from "../../context/ChatProvider";
// Chakra UI
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  FormErrorMessage,
} from "@chakra-ui/react";

const Signup = () => {
  //Local states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  // Global states
  const { setUserState } = useChatContext();
  // Utils
  const history = useHistory();

  // Handle the image- upload to cloudinary and make it a string
  const postDetails = async (pic) => {
    try {
      setLoading(true);
      if (pic === undefined) {
        toastify("Please select an Image", "error");
        setLoading(false);
        return;
      }
      if (pic.type === "image/jpeg" || pic.type === "image/png") {
        const data = new FormData();
        data.append("file", pic);
        data.append("upload_preset", "chatApp");
        data.append("cloud_name", "malachcloud");
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/malachcloud/image/upload",
          {
            method: "POST",
            body: data,
          }
        );
        const result = await res.json();
        setPic(result.url.toString());
        setLoading(false);
      } else {
        toastify("Please select a valid Image", "error");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // Sign up the user
  const submitHandler = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/signup", {
        method: "POST",
        ...config,
        body: JSON.stringify({ name, email, password, ...(pic && { pic }) }),
      });
      const { error, user } = await res.json();
      if (error) {
        toastify(error, "error");
      } else {
        toastify("Registration successful", "success");
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

  // Check if the passwords are match
  useEffect(() => {
    password === confirmPassword
      ? setPasswordError("")
      : setPasswordError("Password do not match");
  }, [confirmPassword]);

  return (
    <VStack color="black">
      {/* Name */}
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          value={name}
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      {/* Email */}
      <FormControl id="email" isRequired style={{ marginTop: 15 }}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      {/* Password */}
      <FormControl id="password" isRequired style={{ marginTop: 15 }}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            type={`${showPassword ? "text" : "password"}`}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowPassword((prevState) => !prevState)}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Confirm Password */}
      <FormControl
        id="confirmPassword"
        isRequired
        style={{ marginTop: 15 }}
        isInvalid={passwordError}
      >
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            value={confirmPassword}
            type={`${showPassword ? "text" : "password"}`}
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowConfirmPassword((prevState) => !prevState)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{passwordError}</FormErrorMessage>
      </FormControl>

      {/* Picture */}
      <FormControl id="pic" style={{ marginTop: 15 }}>
        <FormLabel>Profile Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          placeholder="Enter your email"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      {/* Submit button */}
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
        isDisabled={
          !name || !email || !password || !confirmPassword || passwordError
            ? true
            : false
        }
      >
        Sign up
      </Button>
    </VStack>
  );
};

export default Signup;
