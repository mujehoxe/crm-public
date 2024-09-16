import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import TokenDecoder from "@/app/components/Cookies";
import axios from "axios";
import { FaRegUserCircle } from "react-icons/fa";
import CustomMarker from "./CustomMarker";

// Fix for default marker icon in Leaflet with Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function RealtimeMap() {
  const [onlineAgents, setOnlineAgents] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentHistory, setAgentHistory] = useState({});
  const [agents, setAgents] = useState([]);

  const userData = TokenDecoder();
  const userid = userData ? userData.id : null;
  const userRole = userData ? userData.role : null;

  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const historyEventSourceRef = useRef(null);

  useEffect(() => {
    if (userRole) {
      const fetchAgents = async () => {
        try {
          const response = await axios.get("/api/staff/get");

          let filteredUsers = response.data.data;
          if (userRole === "BussinessHead") {
            const PNLUsers = response.data.data.filter(
              (user) => user.Role === "PNL" && user.PrentStaff === userid
            );
            const PNLIds = PNLUsers.map((user) => user._id);
            const tlUsers = response.data.data.filter(
              (user) => user.Role === "TL" && PNLIds.includes(user.PrentStaff)
            );
            const tlIds = tlUsers.map((user) => user._id);
            const atlUsers = response.data.data.filter(
              (user) => user.Role === "ATL" && tlIds.includes(user.PrentStaff)
            );
            const atlIds = atlUsers.map((user) => user._id);
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && atlIds.includes(user.PrentStaff)
            );
            filteredUsers = [...PNLUsers, ...tlUsers, ...atlUsers, ...fosUsers];
          } else if (userRole === "TL") {
            const atlUsers = response.data.data.filter(
              (user) => user.Role === "ATL" && user.PrentStaff === userid
            );
            const atlIds = atlUsers.map((user) => user._id);
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && atlIds.includes(user.PrentStaff)
            );
            filteredUsers = [...atlUsers, ...fosUsers];
          } else if (userRole === "PNL") {
            const tlUsers = response.data.data.filter(
              (user) => user.Role === "TL" && user.PrentStaff === userid
            );
            const tlIds = tlUsers.map((user) => user._id);
            const atlUsers = response.data.data.filter(
              (user) => user.Role === "ATL" && tlIds.includes(user.PrentStaff)
            );
            const atlIds = atlUsers.map((user) => user._id);
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && atlIds.includes(user.PrentStaff)
            );
            filteredUsers = [...tlUsers, ...atlUsers, ...fosUsers];
          } else if (userRole === "ATL") {
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && user.PrentStaff === userid
            );
            filteredUsers = [...fosUsers];
          } else if (userRole === "FOS") {
            const fosUsers = response.data.data.filter(
              (user) => user.Role === "FOS" && user._id === userid
            );
            filteredUsers = [...fosUsers];
          } else if (userRole === "Admin") {
            filteredUsers = response.data.data;
          }
          filteredUsers = filteredUsers.filter(
            (user) =>
              ![
                "HR",
                "Finance",
                "Manager",
                "Operations",
                "Marketing",
                "SalesHead",
              ].includes(user.Role)
          );

          setAgents(filteredUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchAgents();
    }
  }, [userRole]);

  const connectToSSE = useCallback(() => {
    const eventSource = new EventSource("/api/sse-proxy");

    eventSource.onmessage = (event) => {
      try {
        const data = parseSSEData(event.data);
        const avatar = agents.find((agent) => agent._id === data.id)?.Avatar;
        if (data && data.id) {
          setOnlineAgents((prevAgents) => ({
            ...prevAgents,
            [data.id]: {
              id: data.id,
              lat: data.latitude,
              lng: data.longitude,
              timestamp: data.timestamp,
              Avatar: avatar,
            },
          }));
          setError(null);
        } else {
          console.error("Received invalid data:", data);
          setError("Received invalid data format");
        }
      } catch (error) {
        console.error("Error processing SSE data:", error);
        setError("Error processing data from server");
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      setError("Connection to server lost. Attempting to reconnect...");
      eventSource.close();
      setTimeout(connectToSSE, 5000); // Try to reconnect after 5 seconds
    };

    return eventSource;
  }, [agents]);

  const connectToHistorySSE = useCallback((id) => {
    if (historyEventSourceRef.current) {
      historyEventSourceRef.current.close();
    }

    const eventSource = new EventSource(`/api/history-proxy/${id}`);
    let isInitialHistory = true;

    eventSource.onmessage = (event) => {
      try {
        if (isInitialHistory) {
          // Parse bulk history data
          const historyData = parseHistoryData(event.data);
          setAgentHistory((prevHistory) => ({
            ...prevHistory,
            [id]: historyData.map((item) => ({
              lat: item.latitude,
              lng: item.longitude,
              timestamp: item.timestamp,
            })),
          }));
          isInitialHistory = false;
        } else {
          // Parse individual updates
          const data = parseSSEData(event.data);
          if (data && data.id === id) {
            setAgentHistory((prevHistory) => ({
              ...prevHistory,
              [id]: [
                ...(prevHistory[id] || []),
                {
                  lat: data.latitude,
                  lng: data.longitude,
                  timestamp: data.timestamp,
                },
              ],
            }));
          }
        }
      } catch (error) {
        console.error("Error processing history SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("History SSE error:", error);
      eventSource.close();
      // You might want to implement a reconnection strategy here as well
    };

    historyEventSourceRef.current = eventSource;
  }, []);

  useEffect(() => {
    const eventSource = connectToSSE();

    return () => {
      eventSource.close();
      if (historyEventSourceRef.current) {
        historyEventSourceRef.current.close();
      }
    };
  }, [connectToSSE]);

  const handleAgentSelect = (agentId) => {
    setSelectedAgent(agentId);
    if (agentId) {
      connectToHistorySSE(agentId);
    } else {
      if (historyEventSourceRef.current) {
        historyEventSourceRef.current.close();
      }
      setAgentHistory({});
    }
  };

  return (
    <div className="border rounded-lg shadow-lg overflow-hidden border-gray-200 scrollbar-none">
      <div className="inline-block min-w-full align-middle">
        <div className="w-full h-[36rem] flex">
          <div className="">
            <ul
              role="list"
              className="h-full divide-y w-[382px] divide-gray-100 select-none overflow-y-auto"
            >
              {agents.map((agent) => (
                <li
                  key={agent.email}
                  onClick={(e) => {
                    handleAgentSelect(agent._id);
                  }}
                  className={`flex rounded-md justify-between gap-x-4 px-2 py-4 ${
                    agent._id === selectedAgent
                      ? "bg-miles-100 hover:bg-miles-200"
                      : "hover:bg-gray-100"
                  }
										`}
                >
                  <div className="flex space-x-2 items-center">
                    {agent?.Avatar ? (
                      <img
                        className="h-12 w-12 flex-none bg-gray-50 rounded-full object-contain"
                        src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${
                          agent?.Avatar
                        }`}
                        alt=""
                      />
                    ) : (
                      <FaRegUserCircle
                        className="h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {agent.username}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        {agent.email}
                      </p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900 mb-1">
                      {agent.Role}
                    </p>
                    {Object.values(onlineAgents).filter(
                      (a) => a.id === agent._id
                    ).length > 0 && (
                      <div className="flex items-center gap-x-1.5">
                        <div className="flex-none h-min rounded-full bg-emerald-500/20 p-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </div>
                        <p className="text-xs leading-5 text-gray-500">
                          Online
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-grow">
            {error && <div className="bg-red-500 text-white p-2">{error}</div>}
            <MapContainer
              center={[25.276987, 55.296249]}
              zoom={10}
              className="h-full"
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapUpdater selectedAgent={selectedAgent} agents={onlineAgents} />
              {Object.values(onlineAgents).map((agent) => (
                <CustomMarker
                  key={agent.id}
                  position={[agent.lat, agent.lng]}
                  popupContent={
                    <div>
                      <p>Agent ID: {agent.id}</p>
                      <p>Latitude: {agent.lat}</p>
                      <p>Longitude: {agent.lng}</p>
                      <p>
                        Last Updated:{" "}
                        {new Date(agent.timestamp).toLocaleString()}
                      </p>
                    </div>
                  }
                >
                  <div className="overflow-hidden border-2 border-gray-300 h-12 w-12 rounded-full bg-gray-50 object-cover">
                    {agent.Avatar ? (
                      <img
                        className="h-12 w-12 m-auto flex-none rounded-full"
                        src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${
                          agent?.Avatar
                        }`}
                        alt=""
                      />
                    ) : (
                      <FaRegUserCircle
                        className="h-12 w-12 bg-gray-50 rounded-full text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </CustomMarker>
              ))}
              {selectedAgent && agentHistory[selectedAgent] && (
                <Polyline
                  positions={agentHistory[selectedAgent].map((point) => [
                    point.lat,
                    point.lng,
                  ])}
                  color="red"
                  weight={1}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

const MapUpdater = ({ selectedAgent, agents }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedAgent && agents[selectedAgent]) {
      const { lat, lng } = agents[selectedAgent];
      map.setView([lat, lng], 13);
    }
  }, [selectedAgent]);

  return null;
};

const parseSSEData = (data) => {
  try {
    const cleanedData = data.trim().replace(/^data:\s*/, "");
    return JSON.parse(cleanedData);
  } catch (error) {
    console.error("Error parsing SSE data:", error);
    console.error("Raw SSE data:", data);
    throw error;
  }
};

const parseHistoryData = (data) => {
  try {
    const jsonObjects = data
      .split("\n\n")
      .filter((item) => item.trim() !== "")
      .map((item) => item.replace(/^data:\s*/, "").trim());
    return jsonObjects.map((jsonStr) => JSON.parse(jsonStr));
  } catch (error) {
    console.error("Error parsing history data:", error);
    console.error("Raw history data:", data);
    throw error;
  }
};
