"use server"

import axios from "axios";

export const login = async (prevState: any, formData: any) => {
  const { email, password } = Object.fromEntries(formData);

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_ROUTE}/users/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json", // Set content type to application/json
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
    console.error(error);
  }
};


