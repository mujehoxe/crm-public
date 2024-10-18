import styles from "../Modal.module.css";

const ViewModal = ({ onClose, invoice }) => {
  return (
    <div
      className={`${styles.modalBackdrop} fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}
    >
      <div
        className={`${styles.modalContent} bg-white rounded-lg p-6 shadow-lg max-w-5xl w-full`}
      >
        {/* Close Button */}
        <span
          className={`${styles.closeButton} absolute top-4 right-4 text-2xl cursor-pointer`}
          onClick={onClose}
        >
          &times;
        </span>

        <table className="table-auto mt-8 w-full border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="font-bold text-lg bg-slate-50 border-b border-slate-600">
              <th className="py-3 text-center">Agent Name</th>
              <th className="py-3 text-center">Project Name</th>
              <th className="py-3 text-center">Deal Value</th>
              <th className="py-3 text-center">Commission</th>
              <th className="py-3 text-center">Developer</th>
              <th className="py-3 text-center">Customer Name</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-slate-50 text-md">
            <tr className="border-b border-gray-300 h-[70px]">
              <td className="text-center">
                <p className="m-0 mt-2">{invoice.Userid.username}</p>
              </td>
              <td className="text-center">
                <p className="m-0 mt-2">{invoice.ProjectName}</p>
              </td>
              <td className="text-center">
                <p className="m-0 mt-2">{invoice.Price}</p>
              </td>
              <td className="text-center">
                <p className="m-0 mt-2">
                  {invoice.Comission} {invoice.ComissionType}
                </p>
              </td>
              <td className="text-center">
                <p className="m-0 mt-2">
                  {invoice.Developer} Developer {invoice.othrDeveloper}
                </p>
              </td>
              <td className="text-center">
                <p className="m-0 mt-2">{invoice.buyername}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewModal;
