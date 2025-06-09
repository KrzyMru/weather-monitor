import React, { useCallback, useRef } from "react";
import type { ModalBaseProps } from "./types";

const Modal = (props: ModalBaseProps) => {
    const { open, onClose, children } = { ...props }
    const [render, setRender] = React.useState(false);
    const timer = useRef<number | undefined>(undefined);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const handleClose = useCallback(() => {
        setRender(false);
        if (timer.current !== undefined)
            clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            onClose();
        }, 350);
    }, [onClose]);

    React.useEffect(() => {
        if (open) {
            setRender(true);
        }
    }, [open]);

    React.useEffect(() => {
        // focus trap - keep it inside modal
        const modalElement = modalRef.current;
        if (render && modalElement !== null) {

            // clear focus from background elements 
            requestAnimationFrame(() => { // avoids breaking child autofocus
                const active = document.activeElement;
                const isFocusInside = modalElement.contains(active) && active !== modalElement;
                if (!isFocusInside)
                    modalElement.focus(); // no autofocus elements inside -> focus on modal itself
            });

            // scroll through elements on tab or shift+tab
            const handleTabKeyPress = (event: KeyboardEvent) => {
                if (event.key === "Tab") {
                    // recalculate focusable elements every time - if the first or last become disabled, loop will break
                    const focusableElements = Array.from(modalElement.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    )).filter((elem: Element) => {
                        // exclude disabled elements
                        if ((elem instanceof HTMLButtonElement || elem instanceof HTMLInputElement || elem instanceof HTMLSelectElement || elem instanceof HTMLTextAreaElement) && elem.disabled)
                            return false;
                        return true;
                    });
                    const firstElement = focusableElements[0] as HTMLElement;
                    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                    // loop through interactive elements in modal
                    if (event.shiftKey && (document.activeElement === firstElement 
                        || document.activeElement === modalElement) // correction for focus on modal div - focus would break out of loop otherwise
                    ) {
                        event.preventDefault();
                        lastElement.focus();
                    } else if (!event.shiftKey && document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            };

            // close on escape key press
            const handleEscapeKeyPress = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    handleClose();
                }
            };

            modalElement.addEventListener("keydown", handleTabKeyPress);
            modalElement.addEventListener("keydown", handleEscapeKeyPress);
            return () => {
                modalElement.removeEventListener("keydown", handleTabKeyPress);
                modalElement.removeEventListener("keydown", handleEscapeKeyPress);
            };
        }
    }, [render, handleClose]);

    React.useEffect(() => {
        return () => {
            if (timer.current !== undefined)
                clearTimeout(timer.current);
        }
    }, []);

    return (
        <div
            className={`fixed inset-0 flex justify-center items-center z-9999 ${open ? "visible" : "invisible"} ${render ? "bg-black/20" : "bg-transparent"} focus:outline-none [transition:background-color_350ms]`}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            tabIndex={-1} // focusable for clearing outside focus 
        >
            <div
                className={`rounded-md shadow overflow-auto p-6 w-2xl max-h-full bg-white dark:bg-gray-800 relative ${render ? "scale-100 opacity-100" : "scale-125 opacity-0"} transition-[width_background-color_scale_opacity] duration-350`}
                onClick={event => event.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 p-1 rounded-lg hover:cursor-pointer focus:outline-none focus-visible:inset-ring-3 focus-visible:inset-ring-slate-500 dark:focus-visible:inset-ring-slate-300"
                    onClick={handleClose}
                    title={"Close this modal"}
                    type="button"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="size-[16px] lg:size-[20px] fill-gray-600 fill-gray-900 dark:fill-white transition-[fill_width_height] duration-350"
                    >
                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path>
                    </svg>
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;