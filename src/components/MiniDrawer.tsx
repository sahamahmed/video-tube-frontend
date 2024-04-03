"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import HistoryIcon from "@mui/icons-material/History";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import CollectionsIcon from "@mui/icons-material/Collections";
import LogoutIcon from "@mui/icons-material/Logout";
import Typography from "@mui/material/Typography";
import { useSelector} from "react-redux";
import Image from "next/image";
const drawerWidth = 240;



export default function ResponsiveDrawer() {
  // const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const userDetails = useSelector((state: any) => state.auth.userData);
  console.log("user details are", userDetails?.user);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

 const drawer = (
   <div>
     <Toolbar className="bg-slate-600 m-0 px-4" > <div>{userDetails?.user?.fullName}</div></Toolbar>
     <Divider className="bg-slate-600 m-0 p-0" />
     <List className="bg-slate-600 m-0 p-0">
       {[
         { text: "Home", href: "/", icon: <HomeIcon /> },
         { text: "Liked Videos", href: "/AllVideo", icon: <StarIcon /> },
         { text: "History", href: "/history", icon: <HistoryIcon /> },
         { text: "Login", href: "/login", icon: <HistoryIcon /> },
         { text: "Register", href: "/register", icon: <HistoryIcon /> },
         {
           text: "My Content",
           href: "/my-content",
           icon: <ContentCopyIcon />,
         },
       ].map((item, index) => (
         <ListItem key={item.text} disablePadding>
           <ListItemButton>
             <ListItemIcon>{item.icon}</ListItemIcon>
             <Link href={item.href}>
               <ListItemText primary={item.text} />
             </Link>
           </ListItemButton>
         </ListItem>
       ))}
     </List>
     <Divider className="bg-slate-600" />
     <List className="bg-slate-600">
       {[
         {
           text: "Subscriptions",
           href: "/subscriptions",
           icon: <SubscriptionsIcon />,
         },
         {
           text: "Collections",
           href: "/collections",
           icon: <CollectionsIcon />,
         },
         { text: "Logout", href: "/logout", icon: <LogoutIcon /> },
       ].map((item, index) => (
         <ListItem key={item.text} disablePadding>
           <ListItemButton>
             <ListItemIcon>{item.icon}</ListItemIcon>
             <Link href={item.href}>
               <ListItemText primary={item.text} />
             </Link>
           </ListItemButton>
         </ListItem>
       ))}
     </List>
     <List className="bg-slate-600 h-full"></List>
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
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            VideoTube
          </Typography>
          {userDetails && (
            <div className="ml-auto flex flex-row justify-center items-center gap-2">
              <h1>{userDetails?.user?.username}</h1>
              <div>
                <Image
                  src={userDetails?.user?.avatar}
                  width={50}
                  height={10}
                  alt="avatar"
                  className=" border border-black w-12 h-12 rounded-full object-cover"
                  style={{ borderRadius: "50%" }}
                  priority
                />
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
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
