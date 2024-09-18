import React, { useState } from "react";
import { FaRegUserCircle, FaChevronDown, FaChevronRight } from "react-icons/fa";

const AgentItem = ({ agent, isOnline, isSelected, onSelect, level = 0 }) => (
  <div
    onClick={() => onSelect(agent)}
    className={`
      ${!isOnline(agent) ? "opacity-70" : "cursor-pointer"}
      ${
        isSelected
          ? "bg-miles-100 hover:bg-miles-200"
          : isOnline(agent) && "hover:bg-gray-100"
      }
      flex w-full rounded-md justify-between gap-x-4 px-2 py-4
    `}
  >
    <div className="flex space-x-2 items-center">
      {agent.Avatar ? (
        <img
          className="h-12 w-12 flex-none bg-gray-50 rounded-full object-contain"
          src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${agent.Avatar}`}
          alt=""
        />
      ) : (
        <FaRegUserCircle
          className="h-12 w-12 text-gray-300"
          aria-hidden="true"
        />
      )}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-gray-900">
          {agent.username}
        </span>
        <span className="mt-1 truncate text-xs leading-5 text-gray-500">
          {agent.email}
        </span>
      </div>
    </div>
    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
      <span className="text-sm leading-6 text-gray-900 mb-1">{agent.Role}</span>
      {isOnline(agent) ? (
        <div className="flex items-center gap-x-1.5">
          <div className="flex-none h-min rounded-full bg-emerald-500/20 p-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs leading-5 text-gray-500">Online</span>
        </div>
      ) : (
        <div className="flex items-center gap-x-1.5">
          <div className="flex-none h-min rounded-full bg-emerald-500/20 p-1">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
          </div>
          <span className="text-xs leading-5 text-gray-500">Offline</span>
        </div>
      )}
    </div>
  </div>
);

const AgentTree = ({
  data,
  isAgentOnline,
  selectedAgent,
  handleAgentSelect,
  level = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <li>
      {!data.length > 0 ? (
        <div className="flex items-center">
          {data.subordinates?.length > 0 && (
            <button onClick={toggleExpand} className="mr-2">
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </button>
          )}
          <AgentItem
            agent={data}
            isOnline={isAgentOnline}
            isSelected={data._id === selectedAgent}
            onSelect={handleAgentSelect}
            level={level}
          />
        </div>
      ) : (
        data.map((agent) => (
          <AgentItem
            agent={agent}
            isOnline={isAgentOnline}
            isSelected={agent._id === selectedAgent}
            onSelect={handleAgentSelect}
            level={level}
          />
        ))
      )}

      {isExpanded && data.subordinates?.length > 0 && (
        <ul className="pl-4">
          {data.subordinates.map((subordinate) => (
            <AgentTree
              key={subordinate._id}
              data={subordinate}
              isAgentOnline={isAgentOnline}
              selectedAgent={selectedAgent}
              handleAgentSelect={handleAgentSelect}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const HierarchicalAgentList = ({
  data,
  isAgentOnline,
  selectedAgent,
  handleAgentSelect,
}) => {
  return (
    <div>
      <ul
        role="list"
        className="h-full px-2 divide-y w-[418px] divide-gray-100 select-none overflow-y-auto"
      >
        {data && (
          <AgentTree
            data={data}
            isAgentOnline={isAgentOnline}
            selectedAgent={selectedAgent}
            handleAgentSelect={handleAgentSelect}
          />
        )}
      </ul>
    </div>
  );
};

export default HierarchicalAgentList;
