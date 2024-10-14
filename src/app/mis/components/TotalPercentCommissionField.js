import { NumericFormat } from "react-number-format";

export default function ({ row, index, field }) {
  return (
    <NumericFormat
      className={`p-1 w-[200px] border-1 border-gray-800 rounded-md disabled:!border-0 disabled:!bg-[#F1F5F7]`}
      thousandSeparator=","
      value={field.type.name === "totalPercentComission" && eval(field.value)}
      disabled
    />
  );
}
