import axios from "axios";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchableSelect from "../Leads/dropdown";
import styles from "../Modal.module.css";

const priceModal = ({ userData, onClose2 }) => {
  const [showModal, setShowModal] = useState(true);
  const [savedUser, setSavedUser] = useState(null);
  const [userid, setuserid] = useState(null);

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
    Price: userData.Price,
    ComissionType: userData.ComissionType,
    Comission: userData.Comission,
    TotalComission: userData.TotalComission,
    VAT: userData.VAT,
    loyaltyBonus: userData.loyaltyBonus,
    ComissionVAT: userData.ComissionVAT,
    netcom: userData.netcom,
    SpotCash: userData.SpotCash,
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

    if (priceChangeData.ComissionType === "%") {
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
    priceChangeData.ComissionType,
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
    priceChangeData.ComissionType,
    priceChangeData.Price,
  ]);

  useEffect(() => {
    const vat = (priceChangeData.TotalComission * 5) / 100;

    setPriceChangeData((prevState) => ({
      ...prevState,
      VAT: vat,
    }));
  }, [priceChangeData.TotalComission]);

  useEffect(() => {
    const tic = Number(priceChangeData.VAT + priceChangeData.TotalComission);
    const bonus = priceChangeData?.loyaltyBonus?.replace(/,/g, "");
    setPriceChangeData((prevState) => ({
      ...prevState,
      ComissionVAT: tic,
      netcom: priceChangeData.TotalComission - bonus,
    }));
  }, [priceChangeData.VAT]);

  useEffect(() => {
    const bonus = priceChangeData?.loyaltyBonus?.replace(/,/g, "");
    const tnc = Number(priceChangeData.TotalComission - bonus);

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
      window.location.reload();
      setIsSubmit(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <ToastContainer className="z-50" />
            <span className={styles.closeButton} onClick={onClose2}>
              &times;
            </span>
            <h4 className="text-center">
              {loading ? "Please Wait" : "Change Price"}
            </h4>
            <div className="mt-4 p-0">
              <div className="container">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-0">
                      Unit Price <span className="text-red-500">*</span>
                    </label>
                    <NumericFormat
                      className="w-full border rounded-md p-2"
                      placeholder="Price"
                      value={
                        priceChangeData.Price == 0
                          ? "Unit Price"
                          : parseFloat(
                              String(priceChangeData.Price).replace(/,/g, "")
                            )
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                    <label className="mb-0">
                      Comission <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <NumericFormat
                        className="col-span-3 w-full border rounded-md p-2"
                        disabled={priceChangeData?.ComissionType === ""}
                        placeholder="Comission"
                        thousandSeparator=","
                        value={
                          priceChangeData.Comission === 0
                            ? ""
                            : priceChangeData.ComissionType === "%"
                            ? priceChangeData.Comission
                            : parseFloat(
                                String(priceChangeData.Comission).replace(
                                  /,/g,
                                  ""
                                )
                              )
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        onChange={(e) => {
                          const newComission = e.target.value;
                          if (newComission === "") {
                            setPriceChangeData({
                              ...priceChangeData,
                              Comission: 0,
                            });
                            return;
                          }
                          if (priceChangeData.ComissionType === "%") {
                            if (
                              !isNaN(newComission) &&
                              parseFloat(newComission) <= 100
                            ) {
                              setPriceChangeData({
                                ...priceChangeData,
                                Comission: newComission,
                              });
                            } else {
                              toast.error(
                                "Comission must be a number between 0 and 100"
                              );
                              setPriceChangeData({
                                ...priceChangeData,
                                Comission: 0,
                              });
                            }
                          } else {
                            setPriceChangeData({
                              ...priceChangeData,
                              Comission: newComission,
                            });
                          }
                        }}
                      />
                      <SearchableSelect
                        className="w-[600px] col-span-1"
                        options={commissionCurrency}
                        defaultValue={priceChangeData.ComissionType}
                        value={priceChangeData.ComissionType}
                        onChange={(e) =>
                          setPriceChangeData({
                            ...priceChangeData,
                            ComissionType: e.value,
                            Comission: 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-0">Spot Cash</label>
                    <NumericFormat
                      className="w-full border rounded-md p-2"
                      placeholder="SpotCash"
                      value={
                        priceChangeData.SpotCash == 0
                          ? "SpotCash"
                          : parseFloat(
                              String(priceChangeData.SpotCash).replace(/,/g, "")
                            )
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                    <label className="mb-0">
                      Gross Total Comission{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <NumericFormat
                      className="w-full border rounded-md p-2"
                      placeholder="Gross Total Comission"
                      disabled
                      value={
                        !priceChangeData.TotalComission
                          ? "Net Commission"
                          : priceChangeData.TotalComission.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )
                      }
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>

                  <div>
                    <label className="mb-0">VAT 5%</label>
                    <NumericFormat
                      className="w-full border rounded-md p-2"
                      placeholder="VAT"
                      disabled
                      value={
                        !priceChangeData.VAT
                          ? "Net Commission"
                          : priceChangeData.VAT.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                      }
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>

                  <div>
                    <label className="mb-0">Comission Including VAT</label>
                    <NumericFormat
                      className="w-full border rounded-md p-2"
                      placeholder="Total Comission"
                      disabled
                      value={
                        !priceChangeData.ComissionVAT
                          ? "Net Commission"
                          : priceChangeData.ComissionVAT.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )
                      }
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>

                  <div>
                    <label className="mb-0">Loyalty Bonus</label>
                    <NumericFormat
                      className="w-full border rounded-md p-2"
                      placeholder="Loyalty Bonus"
                      value={
                        !priceChangeData.loyaltyBonus
                          ? "Loyalty Bonus"
                          : parseFloat(
                              String(priceChangeData.loyaltyBonus).replace(
                                /,/g,
                                ""
                              )
                            )
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                    <label className="mb-0">
                      Net Comission/Total Comission
                    </label>
                    <NumericFormat
                      className="w-full border rounded-md p-2"
                      placeholder="Net Comission"
                      disabled
                      value={
                        !priceChangeData.netcom
                          ? "Net Commission"
                          : priceChangeData.netcom.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                      }
                      allowLeadingZeros
                      thousandSeparator=","
                    />
                  </div>
                </div>

                <div className="w-full flex justify-center mt-3">
                  <button
                    onClick={submit}
                    disabled={
                      priceChangeData.Price <= 0 ||
                      priceChangeData.ComissionVAT <= 0 ||
                      priceChangeData.VAT <= 0 ||
                      priceChangeData.TotalComission <= 0 ||
                      priceChangeData.Comission <= 0
                    }
                    className="text-white bg-miles-600 hover:bg-miles-800 font-medium rounded-lg text-sm px-6 py-1"
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

export default priceModal;
