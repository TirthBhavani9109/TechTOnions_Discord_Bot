import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {AllServer, UserData, loading } from "../Atoms/State";
import { ServerWithPresence } from "../Interface";

export const useUserData = () => {
  const id = window.localStorage.getItem("id");
  const setUser = useSetRecoilState(UserData);
  const setTotalServer = useSetRecoilState(AllServer)
  const setLoader = useSetRecoilState(loading);
  const effectRan = useRef(false);
  useEffect(() => {
    if (effectRan.current === false && id) {
      const fetchData = async () => {
        const Response = await axios.get(
          `${import.meta.env.VITE_IP}available_users?user_id=${id}`
        );
        const Response2 = await axios.get(
          `${import.meta.env.VITE_IP}server_List/`
        );
        setTotalServer(Response2.data)
        await setUser(Response.data);
        await setLoader(false);
      };
      fetchData();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);
};
export const useGetserverdata = () => {
  const { guilds } = useRecoilValue(UserData);
  const totalServer = useRecoilValue(AllServer);
  const [userServerWithPresence, setUserServerWithPresence] = useState<ServerWithPresence[]>([]);
  const [loading, setLoading] = useState(true); 
  useUserData();
  useEffect(() => {
    if (guilds.length>0 && totalServer.length >0) {
        console.log(guilds)
        console.log(totalServer)
          const userServerWithPresence1:ServerWithPresence[] = guilds.map((server) => {
            const foundserver =totalServer.find((Tserver)=>Tserver.id == server.id);
            return {
              ...server,
              isPresent: foundserver !==undefined ,
              iconURL: `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png?size=1024`,
            };
          });
          setUserServerWithPresence(userServerWithPresence1);
          console.log(userServerWithPresence1)
          setLoading(false);
    }else {
      console.log("No guild")
    }
  }, [guilds]);
  if (loading) {
    return { userServerWithPresence: [] }; // or return a loading state
  }
  return {
    userServerWithPresence,
  };
};
