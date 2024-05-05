"use client";

import axios from 'axios'
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import HistoryIcon from "@mui/icons-material/History";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import { useDispatch, useSelector} from "react-redux";
import AccountMenu from "./AccountMenu";
import SearchBar from "./SearchBar";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
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
import LogoutIcon from "@mui/icons-material/Logout";
import { usePathname } from "next/navigation";
import useAccessToken from '../lib/accessToken';
import { logout } from '../store/authSlice';
import { useRouter } from 'next/navigation';
import { MdError } from 'react-icons/md';
import { toast } from 'sonner';
import Cookies from "js-cookie";

const drawerWidth = 220;

export default function ResponsiveDrawer() {
  // const { window } = props;
  
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const userDetails = useSelector((state: any) => state.auth.userData);

  const pathname = usePathname()
  const accessToken = useAccessToken()
  const dispatch = useDispatch()
  const router = useRouter()
//  console.log(pathname)

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);  
  };   

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  function logoutUser() {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        dispatch(logout());
        Cookies.remove("accessToken");
        router.push("/login");
        window.location.reload()
      })
      .catch((err) => {
toast("Failed to logout.", {
  className: "bg-red-500 text-white",
  icon: <MdError />,
  position: "top-center"
});         });
  }
  
  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar className="bg-[#36454F] m-0 px-4 text-white text-2xl font-semibold">
        VideoTube
      </Toolbar>
      <Divider className="bg-white m-0 p-0" />

      <List className="bg-[#36454F] m-0 p-0">
        {[
          { text: "Home", href: "/", icon: <HomeIcon /> },
          { text: "Liked Videos", href: "/videos/liked", icon: <StarIcon /> },
          { text: "History", href: "/history", icon: <HistoryIcon /> },
        ].map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{
              backgroundColor: pathname === item.href ? "#333" : "transparent",
            }}
            className={`${
              pathname === item.href
                ? "text-white bg-slate-500"
                : " text-slate-200"
            }`}
          >
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <Link href={item.href}>
                <ListItemText primary={item.text} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List className="bg-[#36454F]">
        {[
          {
            text: "Subscriptions",
            href: "/subscriptions",
            icon: <SubscriptionsIcon />,
          },
          {
            text: "My Channel",
            href: `/profile/${userDetails?._id}`,
            icon: <VideoSettingsIcon />,
          },
        ].map((item, index) => (
          <ListItem
            key={item.text}
            disablePadding
            className={`${
              pathname === item.href
                ? "text-white bg-slate-500"
                : "text-slate-200"
            }`}
          >
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <Link href={item.href}>
                <ListItemText primary={item.text} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List className="bg-[#36454F] h-full">
        <AlertDialog>
          <AlertDialogTrigger>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={`Logout`} className='text-slate-200' />
              </ListItemButton>
            </ListItem>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-slate-500">
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
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar className="bg-[#36454F] flex justify-between">
          <div className="flex items-center justify-center mx-auto pl-4">
            {" "}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 0, px: 0, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            {/* <Typography variant="h6" noWrap component="div"></Typography> */}
            <SearchBar />
          </div>
          {userDetails && (
            <div className="flex items-center">
              {" "}
              <div style={{ cursor: "pointer" }}>
                <AccountMenu userDetails={userDetails} />
              </div>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
