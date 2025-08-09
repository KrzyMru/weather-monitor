interface ModalProps {
    open: boolean;
    onClose: () => void;
}

interface BaseModalProps extends ModalProps {
    children: React.ReactNode;
}

export type { BaseModalProps, ModalProps }