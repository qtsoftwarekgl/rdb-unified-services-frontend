import Button from "@/components/inputs/Button";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal"
import { Controller } from "react-hook-form";
import useRequestCertificate from "./hooks/useRequestCertificate";
import Select from "@/components/inputs/Select";

interface Props {
 showRequestCertificate: boolean;
 setShowRequestCertificate: (show: boolean) => void;
}
const RequestCertificate = ({showRequestCertificate, setShowRequestCertificate}: Props) => {

   const {control, errors, selectOptions, handleSubmit, onSubmit, isRequesting} = useRequestCertificate();
   
    return (
       <Modal isOpen={showRequestCertificate} onClose={() => setShowRequestCertificate(false)}>
         <h1 className="font-semibold text-primary ml-6">Request Certificate</h1>
        <form  onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)();            
        }}>
         <menu className="flex flex-col w-full gap-4 mt-6">
            <Controller
              name="type"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 items-start w-[90%] mx-auto">
                  <Select     
                  label="Certificate type"
                  required
                  options={selectOptions}
                  {...field}
                  placeholder="Select certificate type"
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                />
                    {errors?.type && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.type?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <ul className="w-2/4 ml-3 flex flex-col gap-3 items-center justify-center mt-4">
              <Button
                value={isRequesting ? <Loader /> : `Request`}
                className="w-[90%] mx-auto !text-[14px]"
                submit
                primary
              />
            </ul>
          </menu>
        </form>
        </Modal>
    )
}

export default RequestCertificate;