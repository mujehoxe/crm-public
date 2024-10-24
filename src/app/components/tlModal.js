import axios from "axios";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import SearchableSelect from "../Leads/dropdown";
import styles from "../Modal.module.css";

const TlModal = ({ userData, onClose2 }) => {
  const [showModal, setShowModal] = useState(true);
  const [savedUser, setSavedUser] = useState(null);
  const [parentStaff, setParentStaff] = useState([]);
  const [userid, setuserid] = useState(null);

  const toggleDocumentModal = () => {
    setIsDocumentModalOpen(!isDocumentModalOpen);
  };

  const [loading, setLoading] = useState(false);

  const commissionCurrency = [
    { value: "%", label: "%" },
    { value: "AED", label: "AED" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const imageData = formData.filePreview.split(",")[1];
      const response = await axios.post("/api/staff/add", {
        ...formData,
        image: imageData,
        PrentStaff: formData.PrentStaff, // Use PrentStaff as the key
      });
      setSavedUser(response.data.savedUser);
      setuserid(response.data.savedUser._id);
      setShowModal(false); // Close the Modal
      setIsDocumentModalOpen(true);
      setUsers((prevUsers) => [...prevUsers, response.data.savedUser]); // Update the list of users
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const [priceChangeData, setPriceChangeData] = useState({
    Price: Number(),
    commisionttype: "",
    Comission: Number(),
    TotalComission: Number(),
    VAT: Number(),
    loyaltyBonus: null,
    ComissionVAT: Number(),
    netcom: Number(),
    SpotCash: null,
  });

  useEffect(() => {
    // Ensure the Price and Comission values are strings and not undefined
    const priceString = priceChangeData.Price
      ? priceChangeData.Price.toString()
      : "0";
    const ComissionString = priceChangeData.Comission
      ? priceChangeData.Comission.toString()
      : "0";

    const price = parseFloat(priceString.replace(/,/g, "") || "0");
    const commission = parseFloat(ComissionString.replace(/,/g, "") || "0");

    if (priceChangeData.commisionttype === "%") {
      if (!isNaN(price) && !isNaN(commission)) {
        const gtc = (price * commission) / 100;
        setPriceChangeData((prevState) => ({
          ...prevState,
          TotalComission: gtc,
        }));
      }
    } else {
      if (!isNaN(commission)) {
        setPriceChangeData((prevState) => ({
          ...prevState,
          TotalComission: commission,
        }));
      }
    }
  }, [
    priceChangeData.Price,
    priceChangeData.Comission,
    priceChangeData.commisionttype,
  ]);

  useEffect(() => {
    if (priceChangeData.Comission == "") {
      setPriceChangeData((prevState) => ({
        ...prevState,
        TotalComission: "",
        VAT: "",
        ComissionVAT: "",
        netcom: "",
      }));
    }
  }, [
    priceChangeData.Comission,
    priceChangeData.commisionttype,
    priceChangeData.Price,
  ]);

  useEffect(() => {
    const vat = (priceChangeData.TotalComission * 5) / 100;
    console.log(vat);
    setPriceChangeData((prevState) => ({
      ...prevState,
      VAT: vat,
    }));
  }, [priceChangeData.TotalComission]);

  useEffect(() => {
    const tic = Number(priceChangeData.VAT + priceChangeData.TotalComission);

    setPriceChangeData((prevState) => ({
      ...prevState,
      ComissionVAT: tic,
      netcom: priceChangeData.TotalComission,
    }));
  }, [priceChangeData.VAT]);

  useEffect(() => {
    const tnc = Number(
      priceChangeData.TotalComission - priceChangeData.loyaltyBonus
    );
    if (priceChangeData.TotalComission == priceChangeData.loyaltyBonus) {
      console.log("error");
    }
    setPriceChangeData((prevState) => ({
      ...prevState,
      netcom: tnc,
    }));
  }, [priceChangeData.loyaltyBonus]);

  const [isSubmit, setIsSubmit] = useState(false);
  const submit = async () => {
    setIsSubmit(true);
    try {
      const response = await axios.put(`/api/invoice/table/${userData._id} `, {
        data: { ...userData, ...priceChangeData },
      });
      setIsSubmit(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <span className={styles.closeButton} onClick={onClose2}>
              &times;
            </span>
            <h4 className="text-center">
              {loading ? "Please Wait" : "Change Price"}
            </h4>
            <div className="card-body mt-4 p-0">
              <div className="container">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="!mb-0">
                      Unit Price <span className="text-red-500">*</span>
                    </label>
                    <NumericFormat
                      className="form-control"
                      placeholder="Price"
                      value={
                        priceChangeData.Price === 0
                          ? "Unit Price"
                          : priceChangeData.Price
                      }
                      onChange={(e) =>
                        setPriceChangeData({
                          ...priceChangeData,
                          Price: e.target.value,
                        })
                      }
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>

                  <div>
                    <label className="!mb-0">
                      Commission <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <NumericFormat
                        className="form-control col-span-3"
                        disabled={!priceChangeData.commisionttype}
                        placeholder="Commission"
                        value={
                          priceChangeData.Comission === 0
                            ? "Commission"
                            : priceChangeData.Comission
                        }
                        onChange={(e) =>
                          setPriceChangeData({
                            ...priceChangeData,
                            Comission: e.target.value,
                          })
                        }
                      />
                      <SearchableSelect
                        className="!w-[600px] col-start-3"
                        options={commissionCurrency}
                        value={priceChangeData.commisionttype}
                        onChange={(e) =>
                          setPriceChangeData({
                            ...priceChangeData,
                            commisionttype: e.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="!mb-0">Spot Cash</label>
                    <NumericFormat
                      className="form-control"
                      placeholder="SpotCash"
                      value={
                        priceChangeData.SpotCash === 0
                          ? "SpotCash"
                          : priceChangeData.SpotCash
                      }
                      onChange={(e) =>
                        setPriceChangeData({
                          ...priceChangeData,
                          SpotCash: e.target.value,
                        })
                      }
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>

                  <div>
                    <label className="!mb-0">
                      Gross Total Commission{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <NumericFormat
                      className="form-control"
                      placeholder="Gross Total Commission"
                      disabled
                      value={
                        priceChangeData.TotalComission === 0
                          ? "Gross Total Commission"
                          : priceChangeData.TotalComission.toFixed(2)
                      }
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>

                  <div>
                    <label className="!mb-0">VAT 5%</label>
                    <NumericFormat
                      className="form-control"
                      placeholder="VAT"
                      disabled
                      value={
                        priceChangeData.VAT === 0
                          ? "VAT"
                          : priceChangeData.VAT.toFixed(2)
                      }
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>

                  <div>
                    <label className="!mb-0">Commission Including VAT</label>
                    <NumericFormat
                      className="form-control"
                      placeholder="Commission Including VAT"
                      disabled
                      value={
                        priceChangeData.ComissionVAT === 0
                          ? "Commission Including VAT"
                          : priceChangeData.ComissionVAT.toFixed(2)
                      }
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>

                  <div>
                    <label className="!mb-0">Loyalty Bonus</label>
                    <NumericFormat
                      className="form-control"
                      placeholder="Loyalty Bonus"
                      value={
                        priceChangeData.loyaltyBonus === 0
                          ? "Loyalty Bonus"
                          : priceChangeData.loyaltyBonus
                      }
                      onChange={(e) =>
                        setPriceChangeData({
                          ...priceChangeData,
                          loyaltyBonus: e.target.value,
                        })
                      }
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>

                  <div>
                    <label className="!mb-0">
                      Net Commission/Total Commission
                    </label>
                    <NumericFormat
                      className="form-control"
                      placeholder="Net Commission"
                      disabled
                      value={
                        priceChangeData.netcom === 0
                          ? "Net Commission"
                          : priceChangeData.netcom.toFixed(2)
                      }
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>
                </div>

                <div className="flex justify-center items-center mt-3">
                  <button
                    onClick={submit}
                    disabled={
                      priceChangeData.Price <= 0 ||
                      priceChangeData.ComissionVAT <= 0 ||
                      priceChangeData.VAT <= 0 ||
                      priceChangeData.TotalComission <= 0 ||
                      priceChangeData.Comission <= 0
                    }
                    className="text-white bg-miles-700 hover:bg-miles-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                  >
                    {isSubmit ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TlModal;
