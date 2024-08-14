"use client"

// Utils
import { MAX_LENGTH_SHORT_TEXT } from "@/utils/client/globals"

// Components
import Input from "../Input/Input"

export default function Honeypot() {
    return (
        <Input
            style="honeypot"
            type="text"
            name="address"
            text="Address"
            required={false}
            maxLength={MAX_LENGTH_SHORT_TEXT}
        />
    )
}