'use client'
import React, { useState, useEffect } from "react";
import useAccessToken from "../lib/accessToken";
import axios from "axios";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { MdError } from "react-icons/md";
import { toast } from "sonner";

const PlaylistForm = ({ id = null, mode, children  }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [playlistData, setPlaylistData] = useState(null);
  const accessToken = useAccessToken();
  const router = useRouter();

    

  useEffect(() => {
    if (mode === "edit") {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_ROUTE}/playlist/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        })
        .then((response) => {
          const playlist = response.data.data[0];
          setPlaylistData(playlist);
          setName(playlist.name);
          setDescription(playlist.description);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [accessToken, id, mode]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (mode === "edit") {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/playlist/${id}`,
          {
            name,
            description,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );
      } else if (mode === "create") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/playlist`,
          {
            name,
            description,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );
      }
      router.refresh();
      toast.success("Playlist Details updated.", {
        className: "text-white",
      });  
    } catch (error) {
  toast("Something went Wrong.", {
    className: "bg-red-500 text-white ml-2",
    icon: <MdError />,
});     
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-slate-500 text-white">
        <DialogHeader>
          <DialogTitle>
            {mode == "edit" ? "Edit Playlist" : "Create Playlist"}
          </DialogTitle>
          <DialogDescription>
            <form onSubmit={handleFormSubmit} className="">
              <div className="mb-4">
                <label className="block mb-2" htmlFor="name">
                  Playlist Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 p-2 w-full text-gray-800 font-bold text-xl"
                  required
                  style={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="description">
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 p-2 w-full text-gray-800 text-lg"
                  required
                  style={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                  }}
                />
              </div>
              <Button
                type="submit"
                className={`font-bold py-2 px-4 rounded mt-4 w-full ${loading ? "bg-gray-700 text-slate-400": ""}`}
                variant="secondary"
                disabled={loading}
              >
                {loading ? "Saving" : mode === "edit" ? "Update" : "Create"}
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistForm;
