import * as React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { blue, grey } from "@mui/material/colors";
import MenuIcon from "@mui/icons-material/Menu";
import useAccessToken from "../lib/accessToken";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { MdError } from "react-icons/md";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open } = props;

  const handleClose = (value: string) => {
    onClose(value);
  };

  const handleListItemClick = (playlistId: string) => {
    onClose(playlistId);
  };

  return (
    <Dialog
      onClose={() => handleClose(selectedValue)}
      open={open}
      className="pb-0 mb-0"
    >
      <DialogTitle
        style={{ backgroundColor: grey[800], color: "white" }}
        className="pb-0 mb-0"
      >
        Save to Playlist
      </DialogTitle>
      <List sx={{ pt: 0 , pb: 0 }}>
        {Array.isArray(selectedValue) &&
          selectedValue.length > 0 &&
          selectedValue.map((playlist, index) => (
            <React.Fragment key={playlist._id}>
              {index !== 0 && <hr style={{ borderColor: grey[700] }} />}
              <ListItem
                disableGutters
                style={{ paddingTop: 0, paddingBottom: 0 }}
              >
                <ListItemButton
                  onClick={() => handleListItemClick(playlist._id)}
                  style={{ backgroundColor: grey[900] }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blue[100], color: blue[500] }}>
                      <MenuIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={playlist.name}
                    sx={{ color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            </React.Fragment>
          ))}
      </List>
    </Dialog>
  );
}

export default function SimpleDialogDemo({ videoId, children }) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(null);
  const userDetails = useSelector((state: any) => state.auth.userData);
  const accessToken = useAccessToken();
  const [playlists, setPlaylists] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/playlist/user/${userDetails._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setPlaylists(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken, userDetails]);

  const handleSaveToPlaylist = (playlistId: string, videoId: string) => {
    if(Array.isArray(playlistId) || !videoId){
      // console.log(500)
      return
    }
    console.log(playlistId)
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/playlist/add/${videoId}/${playlistId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setPlaylists(response.data.data);
toast.success("Video added to playlist.", {
  className: "text-white",
});       })     
    // console.log(`Saving video ${videoId} to playlist ${playlistId}`);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
    if (value && value !== "Create Playlist" && videoId) {
      handleSaveToPlaylist(value, videoId);
    }
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>{children}</Button>
      <SimpleDialog
        selectedValue={playlists}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
