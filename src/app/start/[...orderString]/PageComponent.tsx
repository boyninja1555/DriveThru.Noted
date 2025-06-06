"use client"

import type OrderItem from "@/types/order-item"
import { useEffect, useState } from "react"

interface PageComponentProps {
    order: OrderItem[]
}

export default function PageComponent({ order, }: PageComponentProps) {
    const [orderIndex, setOrderIndex] = useState(0)
    const [currentItem, setCurrentItem] = useState<OrderItem>(order[orderIndex])

    useEffect(() => {
        setCurrentItem(order[orderIndex])
    }, [orderIndex])

    const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!redirectUrl)
            return

        window.location.href = redirectUrl
    }, [redirectUrl])

    return (
        <div id="item-card" className="flex flex-col flex-wrap my-[10vh] mx-auto p-[2rem] bg-background-2 rounded-[.5rem] shadow-lg shadow-background-2 max-w-[700px] w-full">
            <h2 className="override-typography wrap-normal text-[3rem] font-bold">{currentItem.size?.toLowerCase() !== "size - n,a" && <em>{currentItem.size} </em>}{currentItem.name}</h2>

            <div className="flex flex-row gap-[1rem]">
                <span className="text-[1.5rem]"><strong>Amount:</strong> x{currentItem.quantity}</span>
                <span className="text-[1.5rem]"><strong>Ordered By:</strong> {currentItem.orderedBy}</span>
            </div>

            <div className="flex flex-row gap-[1rem]">
                {(orderIndex > 0) ? (
                    <span className="font-extrabold text-[2rem] text-red-500 text-shadow-sm text-shadow-red-700 cursor-pointer hover:text-red-600 hover:text-shadow-md" title="See the order before this one" onClick={() => {
                        setOrderIndex(orderIndex - 1)
                    }}>Back</span>
                ) : (
                    <span className="font-extrabold text-[2rem] text-red-500 text-shadow-sm text-shadow-red-700 cursor-pointer hover:text-red-600 hover:text-shadow-md" title="Go back to the order editor" onClick={() => {
                        setRedirectUrl("/")
                    }}>Back</span>
                )}

                {(orderIndex < (order.length - 1)) ? (
                    <span className="font-extrabold text-[2rem] text-green-500 text-shadow-sm text-shadow-green-700 cursor-pointer hover:text-green-600 hover:text-shadow-md" title="See the next order" onClick={() => {
                        setOrderIndex(orderIndex + 1)
                    }}>Next</span>
                ) : (
                    <span className="font-extrabold text-[2rem] text-yellow-500 text-shadow-sm text-shadow-yellow-700 cursor-pointer hover:text-yellow-600 hover:text-shadow-md" title="Finish ordering" onClick={() => {
                        setRedirectUrl("/")
                    }}>Finish</span>
                )}
            </div>
        </div>
    )
}
