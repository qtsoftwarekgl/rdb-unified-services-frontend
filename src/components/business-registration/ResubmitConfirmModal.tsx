import { AppDispatch, RootState } from "@/states/store"
import Modal from "../Modal"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { setResubmitConfirmModal } from "@/states/features/businessRegistrationSlice"
import Button from "../inputs/Button"
import Loader from "../Loader"

interface Props {
  confirmHandler: () => Promise<unknown>
  applicationType: string
  isLoading: boolean
}

const ResubmitConfirmModal = ({
  confirmHandler,
  applicationType,
  isLoading
}: Props) => {
  const dispatch: AppDispatch = useDispatch()
  const { reSubmitConfirmModal } = useSelector(
    (state: RootState) => state.businessRegistration
  )

  return (
    <Modal
      isOpen={reSubmitConfirmModal}
      onClose={() => {
        dispatch(setResubmitConfirmModal(false))
      }}
      heading="Business Application Submission"
      className="min-w-[40vw]"
      headingClassName="text-primary"
    >
      You are going to resubmit requested changes for your {applicationType}{" "}
      business application. Are you sure you want to proceed?
      <menu className="flex items-center justify-between w-full gap-3 mt-4">
        <Button
          value={"Cancel"}
          onClick={(e) => {
            e.preventDefault()
            dispatch(setResubmitConfirmModal(false))
          }}
        />

        <Button
          value={isLoading ? <Loader /> : "Submit again"}
          primary
          onClick={async (e) => {
            e.preventDefault()
            await confirmHandler()
            setResubmitConfirmModal(false)
          }}
        />
      </menu>
    </Modal>
  )
}

export default ResubmitConfirmModal
