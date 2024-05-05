import axios from "axios";
import classNames from "classname";
import { useEffect, useState } from "react";
import useAccessToken from "../lib/accessToken";

const Switch = ({ id, isPublished, onToggle }) => {
  let [isSelected, setIsSelected] = useState(false);
  const accessToken = useAccessToken();

  useEffect(() => {
    if (isPublished) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, []);

  function togglePublish() {
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/videos/toggle/publish/${id}`,
        {},

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data.data.isPublished);
        if (response.data.data.isPublished) {
          setIsSelected(true);
        } else {
          setIsSelected(false);
        }
        onToggle();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div
      onClick={togglePublish}
      className={classNames(
        "flex rounded-full bg-gray-600 w-20 transition-all duration-500 h-10 my-2",
        {
          "bg-green-500": isSelected,
        }
      )}
    >
      <span
        className={classNames(
          "bg-white rounded-full w-10 h-10 transition-all shadow-3xl duration-500 ",
          {
            "ml-10": isSelected,
          }
        )}
      ></span>
    </div>
  );
};
export default Switch;
