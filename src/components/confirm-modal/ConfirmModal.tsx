import { FC } from "react"
import Modal from "../Modal"
import Button from "../inputs/Button"

type Props = {
    isOpen: boolean
    onClose: () => void
    onConfirm: (event: React.MouseEvent<HTMLAnchorElement>) => void
    description: string
    message: string
    children?: React.ReactNode
}

const ConfirmModal : FC<Props> = ({ isOpen, onClose, onConfirm,message,description, children }) => {

    if (!isOpen) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="!max-w-[400px]">
<section className="flex flex-col gap-4 p-8 bg-white rounded-md">
            {children}
            <menu className="flex flex-col gap-4">
              <h3 className="text-base font-semibold">
                {message}
              </h3>
              <h3 className="text-base font-semibold">
                {description}
              </h3>
              <menu className="flex items-center justify-between">
                <Button value="No" onClick={onClose} />
                <Button
                  value="Yes"
                  route="#"
                  primary
                  onClick={(e:React.MouseEvent<HTMLAnchorElement>) => {
                    onConfirm(e)
                    onClose()
                  }}
                />
              </menu>
            </menu>
          </section>
        </Modal>
    )
}

export default ConfirmModal;