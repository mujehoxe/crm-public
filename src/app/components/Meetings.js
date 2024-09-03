import moment from "moment";

function Meetings({ meetings, setMeetingId, leadData }) {
  return (
    <div className="flex flex-col justify-center gap-2 items-center">
      <div className="w-full flex items-center gap-2">
        <p className="text-lg font-[500] !mb-0 !mt-0">Total Meetings </p>{" "}
        <div className="text-lg !mb-0 !mt-0">
          {meetings ? meetings.length : 0}
        </div>
      </div>
      {!meetings || meetings.length <= 0 ? (
        <div className="">
          <p className="text-2xl">No Meeting to show</p>
        </div>
      ) : (
        <div className={`w-full flex flex-col gap-2`}>
          {meetings?.map((meeting, index) => {
            return (
              <div
                key={index}
                className={`w-full bg-slate-50 rounded-md py-2 px-1`}
              >
                <div className="gap-2 items-center">
                  <div className="flex w-full justify-between items-center">
                    <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                      Added by:{" "}
                      <span className="text-lg font-[400]">
                        {meeting.addedby.username}
                      </span>{" "}
                    </p>{" "}
                    <p className="!mb-0 !mt-0 mr-3">
                      {moment(meeting.MeetingDate).format("DD/MM/YYYY")}
                    </p>
                  </div>
                  <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                    Subject:{" "}
                    <span className="text-lg font-[400]">
                      {meeting.Subject}
                    </span>{" "}
                  </p>
                  <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                    Priority:{" "}
                    <span className="text-lg font-[400]">
                      {" "}
                      {meeting.Priority}{" "}
                    </span>
                  </p>
                  <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                    Type:{" "}
                    <span className="text-lg font-[400]">
                      {" "}
                      {meeting.MeetingType}{" "}
                    </span>
                  </p>
                  <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                    Location:{" "}
                    <span className="text-lg font-[400]">
                      {meeting.Location}
                    </span>
                  </p>
                  <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                    Status:{" "}
                    <span className="text-lg font-[400]">{meeting.Status}</span>
                  </p>
                  {meeting.MeetingType == "Secondary" ? (
                    meeting.directoragnet != "Direct" && (
                      <div>
                        {" "}
                        <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                          Agent Name:{" "}
                          <span className="text-lg font-[400]">
                            {" "}
                            {meeting.agentName}
                          </span>
                        </p>{" "}
                        <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                          Agent Company:{" "}
                          <span className="text-lg font-[400]">
                            {" "}
                            {meeting.agentCompany}
                          </span>
                        </p>{" "}
                        <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                          Agent Phone:{" "}
                          <span className="text-lg font-[400]">
                            {" "}
                            {meeting.agentPhone}
                          </span>
                        </p>{" "}
                      </div>
                    )
                  ) : (
                    <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                      Developer:{" "}
                      <span className="text-lg font-[400]">
                        {meeting.Developer}
                      </span>
                    </p>
                  )}
                  <p className="!mb-0 !mt-0 font-Satoshi font-[500] text-black text-lg">
                    Comment:{" "}
                    <span className="text-lg font-[400]">
                      {meeting.Comment}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <button
        onClick={() => {
          setMeetingId(leadData._id);
        }}
        className=" font-Satoshi text-lg !border-0 bg-gray-100 hover:!bg-gray-200 rounded-lg px-3 py-2 font-[400]"
      >
        Add Meeting
      </button>
    </div>
  );
}

export default Meetings;
