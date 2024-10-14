import { NumericFormat } from "react-number-format";

export default function ({ row, index, field, setFilteredData }) {
  return (
    row[field.value] && (
      <div className="w-[130px]">
        <div className="flex items-center gap-1">
          <span className="font-semibold">%: </span>
          <NumericFormat
            className={`p-1 border-1 w-16 border-gray-800 rounded-md border-0`}
            value={row[field.value]}
            onChange={(e) => {
              setFilteredData((prev) => {
                const newData = [...prev];
                const newAgentComissionPercent = Number(e.target.value);

                const totalComission = parseFloat(row?.TotalComission);
                const loyaltyBonus = parseFloat(row?.loyaltyBonus || 0);

                let newAgentComissionAED = 0;

                if (row?.loyaltyBonus) {
                  newAgentComissionAED =
                    ((totalComission - loyaltyBonus) *
                      newAgentComissionPercent) /
                    100;
                } else {
                  newAgentComissionAED =
                    (totalComission * newAgentComissionPercent) / 100;
                }

                newAgentComissionAED = parseFloat(
                  newAgentComissionAED.toFixed(2)
                );

                newData[index][field.accompaniedField] = newAgentComissionAED;
              });
            }}
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">AED: </span>
          <NumericFormat
            className={`p-1 border-1 border-gray-800 rounded-md border-0`}
            value={(
              (parseFloat(row?.netcom) * parseFloat(row[field.value])) /
              100
            ).toFixed(2)}
            thousandSeparator=","
            disabled
          />
        </div>
      </div>
    )
  );
}
