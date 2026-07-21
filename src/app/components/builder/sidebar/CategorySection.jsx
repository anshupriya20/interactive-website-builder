import { ChevronDown } from "lucide-react";

export default function CategorySection({
    title,
    children
}) {

    return (

        <div className="mb-6">

            <button
                className="
                    flex
                    items-center
                    justify-between
                    w-full
                    mb-3
                "
            >

                <span
                    className="
                        text-xs
                        uppercase
                        tracking-wider
                        text-zinc-500
                        font-semibold
                    "
                >
                    {title}
                </span>

                <ChevronDown
                    size={16}
                    className="text-zinc-500"
                />

            </button>

            <div className="space-y-2">
                {children}
            </div>

        </div>

    );

}