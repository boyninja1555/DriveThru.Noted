export type OrderItemSize = "Size - N/A" | "Small" | "Medium" | "Large" | "Extra-Large"

export const OrderItemSizes: OrderItemSize[] = [
    "Size - N/A",
    "Small",
    "Medium",
    "Large",
    "Extra-Large",
]

export default interface OrderItem {
    /**
     * The name of the food item.
     */
    name: string

    /**
     * The size of the food item, if applicable.
     * This can be used for items like drinks or fries.
     */
    size?: OrderItemSize

    /**
     * The quantity of the food item.
     */
    quantity: number

    /**
     * The person who ordered the item.
     * This can be used to track who ordered what in a group order.
     */
    orderedBy: string
}
