"use client"

import type OrderItem from "@/types/order-item"
import type { OrderItemSize } from "@/types/order-item"
import { OrderItemSizes } from "@/types/order-item"
import useAlertSystem from "@/components/AlertSystem"
import { FormEvent, InputHTMLAttributes, JSX, useEffect, useState } from "react"
import clsx from "clsx"

const backgroundColorMap: Record<string, string> = {
	"background-theme-1": "bg-background-theme-1",
	"background-theme-2": "bg-background-theme-2",
	"white": "bg-white",
}

const shadowColorMap: Record<string, string> = {
	"background-theme-1": "shadow-background-theme-1",
	"background-theme-2": "shadow-background-theme-2",
	"white": "shadow-white",
}

function ListComponentWrapper({ children, overridebackgroundcolor, onSubmit, }: {
	children: React.ReactNode
	overridebackgroundcolor?: string
	onSubmit?: (event: FormEvent) => void
}) {
	const bgClass = backgroundColorMap[overridebackgroundcolor ?? "background-theme-1"]

	return (
		<form
			onSubmit={onSubmit}
			className={clsx(
				"override-typography flex flex-row justify-between items-center gap-[1rem] p-[.5rem] rounded-[.5rem] w-full",
				bgClass,
				"shadow-md shadow-background-theme-2"
			)}
		>
			{children}
		</form>
	)
}

interface ListComponentInputProps extends InputHTMLAttributes<HTMLInputElement> {
	showcharlength?: number
	overridebackgroundcolor?: string
	overrideshadowcolor?: string
}

function ListComponentInput(attributes: ListComponentInputProps) {
	const bgClass = backgroundColorMap[attributes.overridebackgroundcolor ?? "background-theme-1"]
	const shadowClass = shadowColorMap[attributes.overrideshadowcolor ?? "background-theme-1"]

	return (
		<input
			type={attributes.type ?? "text"}
			name={attributes.name ?? ""}
			placeholder={attributes.placeholder ?? ""}
			defaultValue={attributes.defaultValue ?? ""}
			className={clsx(
				"py-[.25rem] px-[.5rem] text-foreground-theme-2 rounded-[.5rem] outline-none",
				bgClass,
				"shadow-sm",
				shadowClass,
				`w-[${attributes.showcharlength || 10}rem]`,
				attributes.className
			)}
			{...attributes}
		/>
	)
}

export default function Home() {
	const [loaded, setLoaded] = useState(false)
	const [ordered, setOrdered] = useState<OrderItem[]>([])
	const alertSystem = useAlertSystem()
	const [elementSlot, setElementSlot] = useState<JSX.Element | null>(null)

	useEffect(() => {
		const saved = localStorage.getItem("ordered-latest-save")
		if (saved) setOrdered(JSON.parse(saved) as OrderItem[])
		setLoaded(true)
	}, [])

	useEffect(() => {
		if (!loaded) return
		localStorage.setItem("ordered-latest-save", JSON.stringify(ordered))
	}, [ordered, loaded])

	const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

	useEffect(() => {
		if (redirectUrl) window.location.href = redirectUrl
	}, [redirectUrl])

	return (
		<>
			{elementSlot}

			<h1 className="text-center">Your Current Order</h1>

			<div id="current-order" className="flex flex-col gap-[1rem] mx-auto max-w-[900px] w-full">
				<ListComponentWrapper overridebackgroundcolor="background-theme-2">
					<span className="font-bold text-foreground-theme-1">Food Item</span>
					<span className="text-foreground-theme-2 text-shadow-md text-shadow-gray-500">Size</span>
					<span className="font-semibold text-foreground-theme-2">Quantity</span>
					<span className="text-foreground-theme-2 text-shadow-md text-shadow-gray-500">Ordered By</span>
					<span className="font-extrabold text-red-500 text-shadow-sm text-shadow-red-700">Remove</span>
				</ListComponentWrapper>

				{ordered.map((item, index) => (
					<div key={index}>
						<ListComponentWrapper>
							<span className="font-bold text-foreground-theme-1">{item.name}</span>
							<span className="text-foreground-theme-2 text-shadow-md text-shadow-gray-500">{item.size ?? "N/A"}</span>
							<span className="font-semibold text-foreground-theme-2">{item.quantity}x</span>
							<span className="text-foreground-theme-2 text-shadow-md text-shadow-gray-500">{item.orderedBy}</span>
							<span className="font-extrabold text-red-500 text-shadow-sm text-shadow-red-700 cursor-pointer hover:text-red-600 hover:text-shadow-md" title="Remove" onClick={() => {
								setElementSlot(alertSystem.showConfirmation({
									toConfirm: `Are you sure you want to remove ${item.size} ${item.name} (x${item.quantity}) from your order?`,
									onConfirm: (state: boolean) => {
										if (!state) return setElementSlot(null)
										setOrdered(ordered.filter((_, i) => i !== index))
										setElementSlot(alertSystem.showMessage({
											type: "success",
											message: `Removed ${item.size} ${item.name} (x${item.quantity}) from your order!`,
											onClose: () => setElementSlot(null),
										}))
									},
								}))
							}}>X</span>
						</ListComponentWrapper>
					</div>
				))}

				<ListComponentWrapper overridebackgroundcolor="background-theme-2" onSubmit={(event) => {
					event.preventDefault()
					const form = event.target as HTMLFormElement
					const name = (form["item-name"].value as string).trim()
					const size = (form["item-size"].value as string).trim()
					const quantity = parseInt(form["item-quantity"].value.trim(), 10)
					const orderedBy = form["item-ordered-by"].value?.trim() || "You"

					if (!name || isNaN(quantity) || quantity < 1 || !OrderItemSizes.includes(size as OrderItemSize)) {
						setElementSlot(alertSystem.showMessage({
							type: "error",
							message: "Please fill out all fields correctly!",
							onClose: () => setElementSlot(null),
						}))
						return
					}

					if (ordered.some(item => item.name === name && item.size === size && item.quantity === quantity && item.orderedBy === orderedBy)) {
						setElementSlot(alertSystem.showMessage({
							type: "warning",
							message: "This item is already in your order!",
							onClose: () => setElementSlot(null),
						}))
						return
					}

					setOrdered([...ordered, {
						name,
						size: size as OrderItemSize,
						quantity,
						orderedBy,
					}])
					setElementSlot(alertSystem.showMessage({
						type: "success",
						message: `Added${size.toLowerCase() !== "size - n/a" ? ` ${size}` : ""} ${name} (x${quantity}) to your order!`,
						onClose: () => setElementSlot(null),
					}))
					form.reset()
					form["item-name"].focus()
				}}>
					<div>
						<input type="submit" className="font-extrabold text-green-500 text-shadow-sm text-shadow-green-700 cursor-pointer hover:text-green-600 hover:text-shadow-md" title="Add" value="Add New" />
					</div>

					<div className="flex flex-row flex-wrap gap-[.5rem]">
						<ListComponentInput name="item-name" placeholder="Food Item Name (REQ)" showcharlength={8} overridebackgroundcolor="background-theme-1" overrideshadowcolor="background-theme-1" autoFocus required />

						<select name="item-size" className="py-[.25rem] px-[.5rem] text-foreground-theme-2 bg-background-theme-1 shadow-sm shadow-background-theme-1 rounded-[.5rem] outline-none w-[7rem]" required>
							{OrderItemSizes.map(size => (
								<option key={size} value={size}>{size}</option>
							))}
						</select>

						<ListComponentInput type="number" name="item-quantity" placeholder="Quantity" min={1} showcharlength={6} overridebackgroundcolor="background-theme-1" overrideshadowcolor="background-theme-1" required />
						<ListComponentInput name="item-ordered-by" placeholder="Ordered By (OPT)" showcharlength={8} overridebackgroundcolor="background-theme-1" overrideshadowcolor="background-theme-1" />
					</div>
				</ListComponentWrapper>

				<ListComponentWrapper overridebackgroundcolor="background-theme-2">
					<span className="font-extrabold text-yellow-500 text-shadow-sm text-shadow-yellow-700 cursor-pointer hover:text-yellow-600 hover:text-shadow-md" title="Save all food items" onClick={() => {
						setElementSlot(alertSystem.showMessage({
							type: "warning",
							message: "Saving your orders is currently not supported! For now, your latest order is saved locally.",
							onClose: () => setElementSlot(null),
						}))
					}}>Save Order</span>
					<span className="font-extrabold text-green-500 text-shadow-sm text-shadow-green-700 cursor-pointer hover:text-green-600 hover:text-shadow-md" title="Go through the order item-by-item" onClick={() => {
						setRedirectUrl(`/start/${encodeURIComponent(JSON.stringify(ordered))}`)
					}}>Start Order</span>
					<span className="font-extrabold text-red-500 text-shadow-sm text-shadow-red-700 cursor-pointer hover:text-red-600 hover:text-shadow-md" title="Remove all food items" onClick={() => {
						setElementSlot(alertSystem.showConfirmation({
							toConfirm: "Are you sure you want to delete your entire order? This cannot be undone!",
							onConfirm: (state: boolean) => {
								if (state) setOrdered([])
							},
						}))
					}}>Delete Order</span>
				</ListComponentWrapper>
			</div>
		</>
	)
}
