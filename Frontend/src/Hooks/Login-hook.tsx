import { useEffect, useRef, useState} from "react";
import axios from "axios";

export const setLogin = ({ code }: { code: string }) => {
    window.localStorage.setItem("code", code);
    window.location.assign('/')
};

export const setLogout = async () => {
  await window.localStorage.removeItem("code");
  await window.localStorage.removeItem("id");
  await window.localStorage.removeItem("guild_id");
  window.location.replace(import.meta.env.VITE_LOGOUT_URI)
};

export const getData = () => {
  const code = window.localStorage.getItem("code");
  const id = window.localStorage.getItem("id");
  const [idData,setidData]=useState();
  const effectRan = useRef(false);
  
  useEffect(() => {
    if (effectRan.current === false && id===null) {
      const fetchData = async () => {
        const Response = await axios.get(`${import.meta.env.VITE_IP}callback/?code=${code}`);
        if(Response.data){
          await window.localStorage.setItem("id",Response.data.user.id)
          setidData(Response.data.user.id);
          }
      };
      fetchData();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);
  return idData;
};
