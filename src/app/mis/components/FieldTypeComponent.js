import AgentCommissionField from "./AgentCommissionField";
import AMLRemarksField from "./AMLRemarksField";
import ClaimField from "./ClaimField";
import CommissionField from "./CommissionField";
import CommissionStatusField from "./CommissionStatusField";
import DateField from "./DateField";
import DownloadableField from "./DownloadableField";
import FloatField from "./FloatField";
import FullCommissionField from "./FullCommissionField";
import InputField from "./InputField";
import MonetaryField from "./MonetaryField";
import NumberField from "./NumberField";
import PlotNumberField from "./PlotNumberField";
import SanctionField from "./SanctionField";
import SelectField from "./SelectField";
import TotalPercentCommissionField from "./TotalPercentCommissionField";

const fieldComponents = {
  date: DateField,
  select: SelectField,
  input: InputField,
  number: NumberField,
  float: FloatField,
  plotNumber: PlotNumberField,
  monetary: MonetaryField,
  downloadable: DownloadableField,
  comission: CommissionField,
  agentComission: AgentCommissionField,
  totalPercentComission: TotalPercentCommissionField,
  comissionStatus: CommissionStatusField,
  sanction: SanctionField,
  AMLRemarks: AMLRemarksField,
  fullComission: FullCommissionField,
  claim: ClaimField,
};

const FieldTypeComponent = ({ row, index, field, setFilteredData }) => {
  const Component = fieldComponents[field.type.name];

  if (!Component) {
    console.warn(`No component found for field type: ${field.type.name}`);
    return null;
  }

  return (
    <Component
      row={row}
      index={index}
      field={field}
      setFilteredData={setFilteredData}
    />
  );
};

export default FieldTypeComponent;
