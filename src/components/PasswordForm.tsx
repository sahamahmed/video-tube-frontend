'use client'
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import useAccessToken from "../lib/accessToken";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login as storeLogin } from "../store/authSlice";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface PasswordFormProps {
  oldPassword: string;
  setOldPassword: React.Dispatch<React.SetStateAction<string>>;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  loading: string;
}  

const PasswordForm: React.FC<PasswordFormProps> = ({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  loading
}) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <form className="flex flex-col justify-center items-center p-4 rounded-md mt-2 ">
        {loading && <div className="loading"></div>}

        <div className="mb-4">
          <label
            htmlFor="oldPassword"
            className="block text-gray-300 font-bold mb-2"
          >
            Old Password
          </label>
          <div className="relative">
            <Input
              type={showOldPassword ? "text" : "password"}
              id="oldPassword"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter your old password"
              className="border border-gray-400 rounded px-3 py-2 w-full"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showOldPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-gray-300 font-bold mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              placeholder="Enter your new password"
              className="border border-gray-400 rounded px-3 py-2 w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showNewPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;
