interface ModalProps {
    open: boolean;
    onClose: () => void;
}

interface ModalBaseProps extends ModalProps {
    children: React.ReactNode;
}

export type { ModalBaseProps, ModalProps }