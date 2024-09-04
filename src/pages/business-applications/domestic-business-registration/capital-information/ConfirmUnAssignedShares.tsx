import Button from "@/components/inputs/Button"
import Modal from "@/components/Modal"
import {
  findNavigationFlowByStepName,
  findNavigationFlowMassIdByStepName
} from "@/helpers/business.helpers"
import {
  completeNavigationFlowThunk,
  createNavigationFlowThunk
} from "@/states/features/navigationFlowSlice"
import { setConfirmUnassignedSharesModal } from "@/states/features/shareDetailSlice"
import { AppDispatch, RootState } from "@/states/store"
import { businessId } from "@/types/models/business"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"

interface ConfirmUnAssignedSharesProps {
  businessId: businessId
}

const ConfirmUnAssignedShares = ({
  businessId
}: ConfirmUnAssignedSharesProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch()
  const { confirmUnassignedSharesModal } = useSelector(
    (state: RootState) => state.shareDetail
  )
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  )

  return (
    <Modal
      isOpen={confirmUnassignedSharesModal}
      onClose={() => {
        dispatch(setConfirmUnassignedSharesModal(false))
      }}
      heading="Proceed with unassigned shares?"
      className="min-w-[40vw]"
      headingClassName="text-red-600"
    >
      You are going with unassigned shares. Are you sure you want to proceed?
      You can always assign the shares later by returning to this step.
      <menu className="flex items-center justify-between w-full gap-3 mt-4">
        <Button
          value={"Cancel"}
          onClick={(e) => {
            e.preventDefault()
            dispatch(setConfirmUnassignedSharesModal(false))
          }}
        />

        <Button
          value={"Proceed"}
          primary
          onClick={(e) => {
            e.preventDefault()
            dispatch(
              completeNavigationFlowThunk({
                isCompleted: true,
                navigationFlowId: findNavigationFlowByStepName(
                  businessNavigationFlowsList,
                  "Capital Details"
                )?.id
              })
            )
            dispatch(
              createNavigationFlowThunk({
                businessId,
                massId: findNavigationFlowMassIdByStepName(
                  navigationFlowMassList,
                  "Executive Management"
                ),
                isActive: true
              })
            )
            dispatch(setConfirmUnassignedSharesModal(false))
          }}
        />
      </menu>
    </Modal>
  )
}

export default ConfirmUnAssignedShares
