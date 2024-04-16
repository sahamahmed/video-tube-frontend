'use client'
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ChannelTweets from "./ChannelTweets";
import ChannelPlaylists from "./ChannelPlaylists";
import ChannelVideos from "./ChannelVideos";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
  
export default function BasicTabs({id}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "gray" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{ "& .MuiTab-root": { marginRight: 2 } }}
        >
          <Tab
            label="Videos"
            {...a11yProps(0)}
            className="text-white font-bold"
          />
          <Tab
            label="Playlists"
            {...a11yProps(1)}
            className="text-white font-bold"
          />
          
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ChannelVideos id={id} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ChannelPlaylists id={id} />
      </CustomTabPanel>
      
    </Box>
  );
}
