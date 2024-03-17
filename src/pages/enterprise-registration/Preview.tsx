import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../states/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { Step } from "../../states/features/types";
import {
  addToRegisteredEnterprises,
  resetToInitialState,
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
} from "../../states/features/enterpriseRegistrationSlice";
import { useNavigate } from "react-router-dom";

type Props = {
  isOpen: boolean;
};

const Preview = ({ isOpen }: Props) => {
  const {
    enterprise_attachments,
    enterprise_business_lines,
    enterprise_business_activity_vat,
    enterprise_details,
    enterprise_office_address,
  } = useSelector((state: RootState) => state.enterpriseRegistration);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  const handleEditButton = (step: Step) => {
    dispatch(setEnterpriseActiveTab(step.tab_name));
    dispatch(setEnterpriseActiveStep(step.name));
  };

  const handleSubmit = () => {
    // reset all data
    dispatch(
      addToRegisteredEnterprises({
        enterprise_attachments: { ...enterprise_attachments },
        enterprise_business_lines: [...enterprise_business_lines],
        enterprise_details: { ...enterprise_details, status: "pending" },
        enterprise_office_address: { ...enterprise_office_address },
      })
    );
    dispatch(resetToInitialState());
    navigate("/success", { state: { redirectUrl: "/user-profile" } });
  };

  return (
    <section className="flex flex-col gap-6">
      <section className="flex flex-col gap-6">
        {enterprise_details && (
          <section className="flex flex-col gap-6 px-4 py-2 border rounded-md border-tertiary">
            <menu className="flex items-center justify-between gap-3">
              <h1 className="text-2xl font-bold">Enterprise Details</h1>
              <FontAwesomeIcon
                onClick={() => handleEditButton(enterprise_details?.step)}
                icon={faEdit}
                className="cursor-pointer"
              />
            </menu>
            <p>
              <span className="font-bold">Enterprise Company Name:</span>{" "}
              {enterprise_details?.name}
            </p>
            <p>
              <span className="font-bold">Registration Category:</span>{" "}
              {enterprise_details?.registration_category}
            </p>
            <p>
              <span className="font-bold">Company Type:</span>{" "}
              {enterprise_details?.company_type}
            </p>
          </section>
        )}
        {enterprise_business_activity_vat && (
          <section className="flex flex-col gap-6 px-4 py-2 border rounded-md border-tertiary">
            <menu className="flex items-center justify-between gap-3">
              <h1 className="text-2xl font-bold">Business Activity</h1>
              <FontAwesomeIcon
                onClick={() =>
                  handleEditButton(enterprise_business_activity_vat?.step)
                }
                icon={faEdit}
                className="cursor-pointer"
              />
            </menu>
            {enterprise_business_lines?.map((line, index) => (
              <p key={index}>
                {line.name}
                {line.main && (
                  <span className="text-green-600"> (Main Activity)</span>
                )}
              </p>
            ))}
          </section>
        )}
      </section>
      {enterprise_office_address && (
        <section className="flex flex-col gap-6 px-4 py-2 border rounded-md border-tertiary">
          <menu className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold">Office Address Details</h1>
            <FontAwesomeIcon
              onClick={() => handleEditButton(enterprise_office_address?.step)}
              icon={faEdit}
              className="cursor-pointer"
            />
          </menu>

          <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h1 className="text-base">
                Country:
                <span className="ml-2 text-base font-semibold">
                  {enterprise_office_address?.country}
                </span>
              </h1>
              <h1 className="text-base">
                Province:
                <span className="ml-2 text-base font-semibold">
                  {enterprise_office_address?.province}
                </span>
              </h1>
              <h1 className="text-base">
                District:
                <span className="ml-2 text-base font-semibold">
                  {enterprise_office_address?.district}
                </span>
              </h1>
              <h1 className="text-base">
                Sector:
                <span className="ml-2 text-base font-semibold">
                  {enterprise_office_address?.sector}
                </span>
              </h1>
            </div>
            <div>
              <h1 className="text-base">
                Cell:
                <span className="ml-2 text-base font-semibold">
                  {enterprise_office_address?.cell}
                </span>
              </h1>
              <h1 className="text-base">
                Village:
                <span className="ml-2 text-base font-semibold">
                  {enterprise_office_address?.village}
                </span>
              </h1>
              <h1 className="text-base">
                Street Name:
                <span className="ml-2 text-base font-semibold">
                  {enterprise_office_address?.streetName}
                </span>
              </h1>
              <h1 className="text-base">
                Phone:
                <span className="ml-2 text-base font-semibold">
                  {enterprise_office_address?.phone}
                </span>
              </h1>
            </div>
            <div>
              <h1 className="text-base">
                Fax:
                <span className="ml-2 text-base font-semibold">
                  {enterprise_office_address?.fax}
                </span>
              </h1>
              <h1 className="text-base">
                P O Box:
                <span className="ml-2 text-base font-semibold">
                  {enterprise_office_address?.pob}
                </span>
              </h1>
              <h1 className="text-base text-wrap">
                Email:
                <span className="ml-2 text-sm font-semibold">
                  {enterprise_office_address?.email}
                </span>
              </h1>
            </div>
          </div>
        </section>
      )}
      {enterprise_attachments && (
        <section className="flex flex-col gap-6 px-4 py-2 border rounded-md border-tertiary">
          <menu className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold">Attachments</h1>
            <FontAwesomeIcon
              onClick={() => handleEditButton(enterprise_attachments?.step)}
              icon={faEdit}
              className="cursor-pointer"
            />
          </menu>
          <section className="flex flex-col gap-6">
            {enterprise_attachments?.fileNames?.map((attachment, index) => (
              <p key={index}>{attachment}</p>
            ))}
          </section>
        </section>
      )}
      <menu className="flex items-center justify-center">
        <button
          onClick={handleSubmit}
          disabled={
            !enterprise_attachments &&
            !enterprise_office_address &&
            !enterprise_business_activity_vat &&
            !enterprise_details
          }
          className="px-6 py-2 text-white rounded-md bg-primary"
        >
          Submit
        </button>
      </menu>
    </section>
  );
};

export default Preview;
