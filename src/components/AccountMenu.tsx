'use client'
import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import Image from "next/image";
import Link from "next/link";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout, login as StoreLogin } from "../store/authSlice";
import { useRouter } from "next/navigation";
import KeyIcon from "@mui/icons-material/Key";
import useAccessToken from "../lib/accessToken";
import { useState } from "react";
import PasswordForm from "./PasswordForm";
import { toast } from "sonner";
import { MdError } from "react-icons/md";
import Cookies from "js-cookie";

export default function AccountMenu({ userDetails }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const accessToken = useAccessToken();
    // console.log("access token is ", accessToken);
  const router = useRouter()
  const dispatch = useDispatch()
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false)

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function logoutUser(){
    axios.post(`${process.env.NEXT_PUBLIC_API_ROUTE}/users/logout`,{}, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
    })
    .then((response)=>{
      dispatch(logout());
      Cookies.remove("accessToken");
      router.push("/login");
      window.location.reload();
    })
    .catch((err)=>{
toast("Failed to logout.", {
  className: "bg-red-500 text-white",
  icon: <MdError />,
  position: "top-center",
});      })
  }


   async function handlePasswordChange() {
     if (!oldPassword || !newPassword ) {
toast("Please fill all the fields.", {
  className: "bg-red-500 text-white ",
  icon: <MdError />,
  position: "top-center"
});      
return
     }

     setLoading(true)
     const data = {
       oldPassword: oldPassword,
       newPassword: newPassword,
     };

     try {
       const response = await axios.post(
         `${process.env.NEXT_PUBLIC_API_ROUTE}/users/change-password`,
         data,
         {
           headers: {
             Authorization: `Bearer ${accessToken}`,
           },
         }
       );
       dispatch(StoreLogin(response.data.data));
toast.success("Password updated successfully.", {
  className: "text-white",
});     } catch (error) {
toast("Failed to change password.", {
  className: "bg-red-500 text-white",
  icon: <MdError />,
});
     }
          setLoading(false);  
   }

    const handleLogoutDialogClick = (event:any) => {
      event.stopPropagation(); 
    };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="medium"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Image
              src={userDetails?.avatar}
              width={50}
              height={10}
              alt="avatar"
              className=" border border-black w-12 h-12 rounded-full object-cover"
              style={{ borderRadius: "50%" }}
              priority
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          style: {
            backgroundColor: "#808080",
            color: "white",
          },
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose} className="hover:bg-none ">
          <div className="flex flex-row items-center justify-start gap-2">
            <div>
              <Image
                src={userDetails?.avatar}
                width={50}
                height={10}
                alt="avatar"
                className=" border border-black w-8 h-8 rounded-full object-cover"
                style={{ borderRadius: "50%" }}
                priority
              />
            </div>
            <div>
              <h1>{userDetails?.fullName}</h1>
              <h1>@{userDetails?.username}</h1>
            </div>
          </div>
        </MenuItem>
        <Divider></Divider>
        <Link href={`/profile/${userDetails?._id}`}>
          <MenuItem onClick={handleClose}>
            <Avatar />  
            View Channel
          </MenuItem>
        </Link>
        <Divider />

        <Link href={`/update/${userDetails?._id}`}>
          <MenuItem onClick={handleClose} className="my-2">
            <ListItemIcon>
              <BorderColorIcon fontSize="small" />
            </ListItemIcon>
            Account Details
          </MenuItem>
        </Link>

        <MenuItem onClick={handleClose}>
          <AlertDialog>
            <AlertDialogTrigger onClick={handleLogoutDialogClick}>
              <ListItemIcon>
                <KeyIcon fontSize="small" />
              </ListItemIcon>
              Edit Password
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-500">
              <AlertDialogHeader>
                <AlertDialogTitle>Update your password</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-200">
                  <PasswordForm
                    oldPassword={oldPassword}
                    setOldPassword={setOldPassword}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-600 text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-yellow-500 text-white hover:bg-yellow-700"
                  onClick={handlePasswordChange}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </MenuItem>

        <MenuItem>
          <AlertDialog>
            <AlertDialogTrigger onClick={handleLogoutDialogClick}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-600">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to Logout?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-200">
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-600 text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 text-white"
                  onClick={logoutUser}
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
