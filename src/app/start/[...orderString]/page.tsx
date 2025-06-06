import type OrderItem from "@/types/order-item"
import PageComponent from "./PageComponent"

interface StartOrderProps {
    params: Promise<{
        orderString: string
    }>
}

export default async function StartOrder({ params, }: StartOrderProps) {
    const { orderString } = await params
    const order = JSON.parse(decodeURIComponent(orderString)) as OrderItem[]

    return <PageComponent order={order} />
}
