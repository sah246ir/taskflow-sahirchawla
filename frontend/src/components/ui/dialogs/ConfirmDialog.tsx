import { Button, type ButtonvariantType } from "@/components/shadcn/button"
import type { ReactNode } from "react"
import { AlertDialogContainer } from "../wrappers/AlertDialogWrapper"
import { LoadingButton } from "../buttons/LoadingButton"


type ConfirmDialogProps = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  title?: string
  description?: string
  children?: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  isConfirmLoading?: boolean
  confirmVariant?: ButtonvariantType
}

export const ConfirmDialog = ({
  isOpen,
  setOpen,
  title,
  description,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isConfirmLoading = false,
  confirmVariant = 'default',
}: ConfirmDialogProps) => {
  return (
    <AlertDialogContainer
      isOpen={isOpen}
      setOpen={setOpen}
      title={title}
      description={description}
      className="w-[520px]"
    >
      <div className="space-y-4">
        {children}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => {
              onCancel?.()
              setOpen(false)
            }}
          >
            {cancelText}
          </Button>
          <LoadingButton
            variant={confirmVariant}
            onClick={() => {
              onConfirm?.()
            }}
            isLoading={isConfirmLoading}
          >
            {confirmText}
          </LoadingButton>
        </div>
      </div>
    </AlertDialogContainer>
  )
}

