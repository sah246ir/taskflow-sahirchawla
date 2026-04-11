import { AlertDialogHeader, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription } from '@/components/shadcn/alert-dialog'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface PropTypes{
    isOpen:boolean,
    setOpen:(val:boolean)=>void
    children:ReactNode,
    title?:string,
    description?:string,
    className?:string
}
export const AlertDialogContainer = ({isOpen,setOpen,description,title,children,className}:PropTypes) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={setOpen}>
            <AlertDialogContent className={cn(`w-[500px] max-h-[80vh] overflow-y-auto px-7`,className)}>
                <AlertDialogHeader>
                    <div className="flex items-start justify-between w-full">
                        <div>
                            {title && <AlertDialogTitle className='text-2xl font-medium'>{title}</AlertDialogTitle>}
                            {description && (
                                <AlertDialogDescription className=''>
                                    {description}
                                </AlertDialogDescription>
                            )}
                        </div> 
                        <button
                            type="button"
                            aria-label="Close"
                            className="text-red-400 hover:text-red-600 ml-4 cursor-pointer transition duration-200"
                            onClick={() => setOpen(false)}
                            style={{ lineHeight: 1 }}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </AlertDialogHeader>
                <div>
                    {children}
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}