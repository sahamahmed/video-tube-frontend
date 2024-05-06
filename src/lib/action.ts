"use server"

import axios from "axios";


export const login = async (prevState: any, formData: any) => {
  const { email, password } = Object.fromEntries(formData);

  if (!email || !password) {
    // toast.error("Please fill in all fields");
    return { error: "Please fill in all fields" };
  }
 

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_ROUTE}/users/login`,

      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json", 
        },
      }
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (err) {
    console.log(err);
    return { error: "Invalid username or password" };
  }
};


export const register = async (prevState: any, formData: any) => {
  const { fullName, username, email, password, avatar, coverImage } =
    Object.fromEntries(formData);

    if (!fullName || !username || !email || !password) {
      return { error: "Please fill all required fields" };
    }

  const data = new FormData();
  data.append("fullName", fullName);
  data.append("username", username);
  data.append("email", email);
  data.append("password", password);
  data.append("avatar", avatar);
  data.append("coverImage", coverImage);

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_ROUTE}/users/register`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data.data);
    return response.data;
  } catch (error) {
    if (error.message == "Request failed with status code 409") {
          return { error: "email or username already exists" };
    }else{
                return { error: "Failed to sign In, try again later." };

    }
  }
};

  



