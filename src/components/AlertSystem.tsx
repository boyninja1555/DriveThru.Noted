"use client"

import { useState } from "react"

interface MessageBoxProps {
    type: "success" | "info" | "warning" | "error"
    message: string
    onClose: () => void
}

export function MessageBox({ type, message, onClose, }: MessageBoxProps) {
    const [isVisible, setIsVisible] = useState(true)
    const typeClasses = {
        success: "bg-green-100 text-green-800 shadow-green-200",
        info: "bg-blue-100 text-blue-800 shadow-blue-200",
        warning: "bg-yellow-100 text-yellow-800 shadow-yellow-200",
        error: "bg-red-100 text-red-800 shadow-red-200",
    }

    return <>
        {isVisible && (
            <div className={`p-[1rem] rounded-[.5rem] shadow-md max-w-[30rem] bottom-[1rem] right-[1rem] fixed z-[1000000] ${typeClasses[type]}`}>
                <span>{message}</span>

                <div className="flex flex-row justify-end gap-[1rem] mt-[1rem]">
                    <span className="font-extrabold text-shadow-sm cursor-pointer hover:text-shadow-md"
                        onClick={() => {
                            setIsVisible(false)
                            onClose()
                        }}
                    >Close</span>
                </div>
            </div>
        )}
    </>
}

interface ConfirmationBoxProps {
    toConfirm: string
    onConfirm: (state: boolean) => void
}

export function ConfirmationBox({ toConfirm, onConfirm }: ConfirmationBoxProps) {
    const [isVisible, setIsVisible] = useState(true)

    return isVisible ? (
        <div className="p-[1rem] rounded-[.5rem] shadow-md bg-blue-100 text-blue-800 shadow-blue-200 w-[30rem] bottom-[1rem] right-[1rem] fixed z-[1000000]">
            <span>{toConfirm}</span>

            <div className="flex flex-row justify-end gap-[1rem] mt-[1rem]">
                <span className="font-extrabold text-green-500 text-shadow-sm text-shadow-green-700 cursor-pointer hover:text-green-600 hover:text-shadow-md"
                    onClick={() => {
                        onConfirm(true)
                        setIsVisible(false)
                    }}
                >Yes</span>
                <span className="font-extrabold text-red-500 text-shadow-sm text-shadow-red-700 cursor-pointer hover:text-red-600 hover:text-shadow-md"
                    onClick={() => {
                        onConfirm(false)
                        setIsVisible(false)
                    }}
                >No</span>
            </div>
        </div>
    ) : <div data-type="alertsystem-empty" />
}

export default function useAlertSystem() {
    return {
        showMessage: (props: MessageBoxProps) => {
            return <MessageBox {...props} />
        },
        showConfirmation: (props: ConfirmationBoxProps) => {
            return <ConfirmationBox {...props} />
        }
    }
}
