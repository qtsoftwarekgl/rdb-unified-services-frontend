import { AppDispatch, RootState } from "@/states/store"
import Modal from "../Modal"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { setConfirmPreviewModal } from "@/states/features/businessRegistrationSlice"
import Button from "../inputs/Button"
import Loader from "../Loader"

interface Props {
  confirmHandler: () => Promise<unknown>
  applicationType: string
  isLoading: boolean
}

const ConfirmPreviewModal = ({
  confirmHandler,
  applicationType,
  isLoading
}: Props) => {
  const dispatch: AppDispatch = useDispatch()
  const { confirmPreviewModal } = useSelector(
    (state: RootState) => state.businessRegistration
  )

  return (
    <Modal
      isOpen={confirmPreviewModal}
      onClose={() => {
        dispatch(setConfirmPreviewModal(false))
      }}
      heading="Business Application Submission"
      className="min-w-[40vw]"
      headingClassName="text-primary"
    >
      You are going to submit {applicationType} business application. Are you
      sure you want to proceed?
      <menu className="flex items-center justify-between w-full gap-3 mt-4">
        <Button
          value={"Cancel"}
          onClick={(e) => {
            e.preventDefault()
            dispatch(setConfirmPreviewModal(false))
          }}
        />

        <Button
          value={isLoading ? <Loader /> : "Submit"}
          primary
          onClick={async (e) => {
            e.preventDefault()
            await confirmHandler()
            setConfirmPreviewModal(false)
          }}
        />
      </menu>
    </Modal>
  )
}

export default ConfirmPreviewModal
