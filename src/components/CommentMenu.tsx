import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { CiMenuKebab } from "react-icons/ci";


const options = [
  "Edit",
  "Delete",
];

const ITEM_HEIGHT = 40;

export default function LongMenu({commentId, onDelete, onUpdate}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
      onDelete(commentId);
        setAnchorEl(null);
  }

   const handleEdit = () => {
    onUpdate()
     setAnchorEl(null);
   };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <CiMenuKebab className="text-white" />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "12ch",
            paddingRight: 0,
            backgroundColor: "#374151",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === "Pyxis"}
            onClick={option === "Delete" ? handleDelete : handleEdit}
            className=" text-white hover:bg-slate-200 hover:text-gray-800"
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );

}
