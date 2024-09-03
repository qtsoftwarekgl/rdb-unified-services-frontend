import React, { useState } from "react";
import Modal from "@/components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import useReservedName from "./hooks/useReservedName";
import { useDispatch } from "react-redux";
import { ReservedName } from "@/types/models/reservedName";
import { formatExpiresIn } from "@/helpers/strings";
import Input from "@/components/inputs/Input";
import { Checkbox } from "@/components/ui/checkbox"
import { setSelectedReservedName } from "@/states/ui/businessRegistrationUISlice";

const SelectReservedName = () => {
  const { showSelectReservedName, setShowSelectReservedName, setEnterpriseBusinessName, handleSkip, reservedNames, handleSubmit, onSubmit, setValue, errors, clearErrors, selectedReservedName } = useReservedName();
  const [searchByCode, setSearchByCode] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleSelect = (name: ReservedName) => {
    dispatch(setSelectedReservedName(name));
  };

  const handleConfirm = () => {
    if (selectedReservedName) {
      setEnterpriseBusinessName(selectedReservedName);
      // dispatch(setSelectedReservedName(selectedReservedName));
      dispatch(setShowSelectReservedName(false));
    }
  };

  const toggleSearchByCode = () => {
    setSearchByCode(!searchByCode);
  };

  return (
    <Modal
      className="min-w-[30%]"
      onClose={() => dispatch(setShowSelectReservedName(false))}
      isOpen={showSelectReservedName}
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-primary">USE RESERVED NAME</h2>
        
        <div className="mb-4">
          <label className="flex items-center cursor-pointer gap-2">
            <Checkbox
              checked={searchByCode}
              onCheckedChange={toggleSearchByCode}
              id="searchByCode"
              color="primary"
              className="mr-2 border-primary text-primary focus:ring-primary data-[state=checked]:bg-primary"
            />
            <div className="flex flex-col">
              <span className="text-xs">Search with reservation code</span>
              <span className="text-[10px] italic text-gray-400">  Looking for a name reserved by someone else? Use the reservation code to find it.</span>
            </div>
          </label>
        </div>
        
        {searchByCode && (
          <div className="mb-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                placeholder="Enter reservation code"
                onChange={(e) => {
                  setValue("code",e.target.value)
                  clearErrors("code")
                }}
                showSearchSuffix={true}
                suffixIconPrimary
                suffixIconHandler={handleSubmit(onSubmit)}
                />
                {errors.code && <span className="text-red-500 text-xs">{errors.code.message}</span>}
            </form>
          </div>
        )}
        
        <ul className="mb-6">
          {reservedNames.map((reservedName: ReservedName) => (
            <li
              key={reservedName.id}
              className={`relative cursor-pointer mt-2 p-4 rounded-md border ${
                (selectedReservedName as ReservedName)?.name === reservedName.name
                  ? "bg-gray-300 border-primary"
                  : "bg-background border-gray-300"
              }`}
              onClick={() => handleSelect(reservedName)}
            >
              {(selectedReservedName as ReservedName)?.name === reservedName.name && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="absolute top-2 right-2 text-primary"
                />
              )}
              <div className="font-bold">{reservedName.name}</div>
              <div className="text-sm text-gray-500">{reservedName.code}</div>
              <div className="text-xs text-green-700 mt-1">Expires in {formatExpiresIn(reservedName.expiryDate)}</div>
            </li>
          ))}
        </ul>
        
        <div className="flex justify-between">
          <button
            className="w-full py-2 text-sm px-4 rounded-md bg-gray-200 text-gray-600 mr-2"
            onClick={handleSkip}
          >
            Continue without reserved name
          </button>
          <button
            className={`w-full text-sm py-2 px-4 rounded-md ${
              selectedReservedName
                ? "bg-primary text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleConfirm}
            disabled={!selectedReservedName}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SelectReservedName;
